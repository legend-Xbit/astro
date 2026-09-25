#!/usr/bin/env node
/**
 * Structural validator for `.agents/skills`. No dependencies, no model calls, no network.
 *
 * Checks the invariants the live eval runner assumes and would otherwise fail on late and
 * expensively: frontmatter shape, name/directory agreement, resolvable relative links, and a
 * well-formed eval manifest whose fixture paths exist inside the repository.
 *
 * Usage:
 *   node .agents/tools/validate-skills.mjs [skillsDir] [--min-evals=N] [--max-lines=N] [--strict]
 *
 * Exits non-zero on any error, or on any warning under `--strict`.
 */
import { existsSync, lstatSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
	const match = args.find((arg) => arg.startsWith(`--${name}=`));
	return match ? Number(match.slice(name.length + 3)) : fallback;
};
const positional = args.filter((arg) => !arg.startsWith('--'));
const skillsDir = resolve(positional[0] ?? '.agents/skills');
const repoRoot = resolve(skillsDir, '..', '..');
const minEvals = flag('min-evals', 3);
const maxLines = flag('max-lines', 150);
const strict = args.includes('--strict');

const errors = [];
const warnings = [];
const error = (skill, message) => errors.push(`${skill}: ${message}`);
const warn = (skill, message) => warnings.push(`${skill}: ${message}`);

if (!existsSync(skillsDir)) {
	console.error(`No skills directory at ${skillsDir}`);
	process.exit(1);
}

const skillDirectories = readdirSync(skillsDir, { withFileTypes: true })
	.filter((entry) => entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.'))
	.map((entry) => join(skillsDir, entry.name))
	.sort();

if (skillDirectories.length === 0) {
	console.error(`No skills found in ${skillsDir} (directories starting with "_" are skipped).`);
	process.exit(1);
}

for (const skillDirectory of skillDirectories) {
	const name = skillDirectory.split(sep).at(-1);
	validateSkill(name, skillDirectory);
}

report();

function validateSkill(name, skillDirectory) {
	const skillPath = join(skillDirectory, 'SKILL.md');
	if (!existsSync(skillPath)) {
		error(name, 'missing SKILL.md');
		return;
	}

	const source = readFileSync(skillPath, 'utf8');
	const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(source);
	if (!match) {
		error(name, 'SKILL.md has no YAML frontmatter block');
		return;
	}
	const [, frontmatter, body] = match;

	const declaredName = readField(frontmatter, 'name');
	if (!declaredName) error(name, 'frontmatter is missing `name`');
	else if (declaredName !== name) {
		error(name, `frontmatter name is "${declaredName}" but the directory is "${name}"`);
	}

	const description = readField(frontmatter, 'description');
	if (!description) {
		error(name, 'frontmatter is missing `description`');
	} else {
		if (description.length < 40) {
			warn(name, 'description is very short; it is the only text the model sees when routing');
		}
		if (description.length > 1024) {
			warn(name, `description is ${description.length} chars; keep it under ~1024`);
		}
		if (!/\buse\b|\btrigger\b|\bwhen\b/i.test(description)) {
			warn(name, 'description names no trigger condition ("Use when ...") and may never fire');
		}
	}

	if (body.trim() === '') error(name, 'SKILL.md has no body below the frontmatter');

	const lineCount = source.split('\n').length;
	if (lineCount > maxLines) {
		warn(name, `SKILL.md is ${lineCount} lines (>${maxLines}); move detail into a linked file`);
	}

	for (const file of walk(skillDirectory, name)) {
		if (file.endsWith('.md')) validateLinks(name, file);
	}

	validateEvals(name, skillDirectory);
}

function validateEvals(name, skillDirectory) {
	const manifestPath = join(skillDirectory, 'evals', 'evals.json');
	if (!existsSync(manifestPath)) {
		error(name, 'missing evals/evals.json');
		return;
	}

	let manifest;
	try {
		manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
	} catch (cause) {
		error(name, `evals/evals.json is not valid JSON: ${cause.message}`);
		return;
	}

	if (!isRecord(manifest)) {
		error(name, 'evals/evals.json must be an object');
		return;
	}
	if (manifest.skill_name !== name) {
		error(name, `evals/evals.json skill_name is ${JSON.stringify(manifest.skill_name)}, expected ${JSON.stringify(name)}`);
	}
	if (!Array.isArray(manifest.evals) || manifest.evals.length === 0) {
		error(name, 'evals/evals.json must contain a non-empty `evals` array');
		return;
	}
	if (manifest.evals.length < minEvals) {
		warn(name, `has ${manifest.evals.length} eval case(s); ${minEvals} is the useful minimum (happy path, early exit, negative)`);
	}

	const ids = new Set();
	manifest.evals.forEach((testCase, index) => {
		const label = `eval ${index + 1}`;
		if (!isRecord(testCase)) {
			error(name, `${label} must be an object`);
			return;
		}
		if (!Number.isInteger(testCase.id) || testCase.id < 1) {
			error(name, `${label} needs a positive integer \`id\``);
		} else if (ids.has(testCase.id)) {
			error(name, `${label} reuses id ${testCase.id}`);
		} else {
			ids.add(testCase.id);
		}

		for (const field of ['prompt', 'expected_output']) {
			if (typeof testCase[field] !== 'string' || testCase[field].trim() === '') {
				error(name, `${label} needs a non-empty \`${field}\``);
			}
		}

		if (!Array.isArray(testCase.assertions) || testCase.assertions.length === 0) {
			error(name, `${label} needs a non-empty \`assertions\` array`);
		} else if (testCase.assertions.some((item) => typeof item !== 'string' || item.trim() === '')) {
			error(name, `${label} assertions must all be non-empty strings`);
		}

		if (testCase.files !== undefined && !Array.isArray(testCase.files)) {
			error(name, `${label} \`files\` must be an array`);
		} else {
			for (const file of testCase.files ?? []) {
				if (typeof file !== 'string' || file.trim() === '') {
					error(name, `${label} \`files\` entries must be non-empty strings`);
					continue;
				}
				if (isAbsolute(file) || file.split(/[\\/]/).includes('..')) {
					error(name, `${label} fixture path escapes the repository: ${file}`);
					continue;
				}
				const absolute = resolve(repoRoot, file);
				if (!absolute.startsWith(repoRoot + sep) || !existsSync(absolute)) {
					error(name, `${label} fixture does not exist: ${file}`);
				}
			}
		}
	});
}

function validateLinks(name, filePath) {
	const source = readFileSync(filePath, 'utf8');
	const fileLabel = relative(skillsDir, filePath).split(sep).join('/');
	for (const [, target] of source.matchAll(/\]\(([^)\s]+)\)/g)) {
		if (/^(https?:|mailto:|#)/.test(target) || target.includes('<')) continue;
		const cleaned = target.split('#')[0];
		if (cleaned === '') continue;
		const base = cleaned.startsWith('/') ? join(repoRoot, cleaned) : resolve(filePath, '..', cleaned);
		if (!existsSync(base)) error(name, `${fileLabel} links to a missing path: ${target}`);
	}
}

function* walk(directory, name) {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const absolute = join(directory, entry.name);
		if (entry.isSymbolicLink() || lstatSync(absolute).isSymbolicLink()) {
			error(name, `skill resources cannot be symbolic links: ${relative(skillsDir, absolute)}`);
			continue;
		}
		if (entry.isDirectory()) {
			if (entry.name === 'evals') continue;
			yield* walk(absolute, name);
		} else if (statSync(absolute).isFile()) {
			yield absolute;
		}
	}
}

function readField(frontmatter, field) {
	const match = new RegExp(`^${field}:\\s*(.+)$`, 'm').exec(frontmatter);
	if (!match) return undefined;
	const value = match[1].trim();
	if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
	if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value);
	return value;
}

function isRecord(value) {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function report() {
	const checked = skillDirectories.length;
	for (const warning of warnings) console.warn(`warn  ${warning}`);
	for (const failure of errors) console.error(`error ${failure}`);
	const summary = `${checked} skill(s) checked, ${errors.length} error(s), ${warnings.length} warning(s)`;
	if (errors.length > 0 || (strict && warnings.length > 0)) {
		console.error(summary);
		process.exit(1);
	}
	console.log(summary);
}
