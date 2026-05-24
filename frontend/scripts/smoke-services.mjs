import { createServer } from 'vite';

const ZERO_UUID = '00000000-0000-0000-0000-000000000000';

function formatResult(result) {
  if (Array.isArray(result)) {
    return `${result.length} item(s) ${JSON.stringify(result).slice(0, 250)}`;
  }

  return `object ${JSON.stringify(result).slice(0, 250)}`;
}

const server = await createServer({
  configFile: false,
  root: process.cwd(),
  server: { middlewareMode: true },
});

try {
  const profiles = await server.ssrLoadModule('/src/services/profiles.ts');
  const projects = await server.ssrLoadModule('/src/services/projects.ts');
  const evaluations = await server.ssrLoadModule('/src/services/evaluations.ts');
  const roles = await server.ssrLoadModule('/src/services/roles.ts');
  const questions = await server.ssrLoadModule('/src/services/questions.ts');
  const reports = await server.ssrLoadModule('/src/services/reports.ts');

  const tests = [
    ['getAllProfiles', () => profiles.getAllProfiles()],
    ['getProfilesByRole(admin)', () => profiles.getProfilesByRole('admin')],
    ['getRoles', () => roles.getRoles()],
    ['getQuestions', () => questions.getQuestions()],
    ['getQuestions(technical)', () => questions.getQuestions('technical')],
    ['getProjects', () => projects.getProjects()],
    ['getProjectMembers(zero uuid)', () => projects.getProjectMembers(ZERO_UUID)],
    ['getMyProjects(zero uuid)', () => projects.getMyProjects(ZERO_UUID)],
    ['getEvaluationsByEmployee(zero uuid)', () => evaluations.getEvaluationsByEmployee(ZERO_UUID)],
    ['getEvaluationsByLeader(zero uuid)', () => evaluations.getEvaluationsByLeader(ZERO_UUID)],
    ['getEvaluationsByProject(zero uuid)', () => evaluations.getEvaluationsByProject(ZERO_UUID)],
    ['getSummary', () => reports.getSummary('semester-1-2026')],
    ['getTopPerformers', () => reports.getTopPerformers('semester-1-2026')],
    ['getDepartmentStats', () => reports.getDepartmentStats('semester-1-2026')],
  ];

  for (const [name, run] of tests) {
    try {
      const result = await run();
      console.log(`OK ${name}: ${formatResult(result)}`);
    } catch (error) {
      console.log(`ERRO ${name}: ${error?.message ?? String(error)}`);
    }
  }
} finally {
  await server.close();
}
