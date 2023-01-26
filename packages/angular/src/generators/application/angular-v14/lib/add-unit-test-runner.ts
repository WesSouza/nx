import { ensurePackage, Tree } from '@nrwl/devkit';
import { nxVersion } from '../../../../utils/versions';
import { UnitTestRunner } from '../../../../utils/test-runners';
import type { NormalizedSchema } from './normalized-schema';

export async function addUnitTestRunner(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner === UnitTestRunner.Jest) {
    await ensurePackage(host, '@nrwl/jest', nxVersion);
    const { jestProjectGenerator } = require('@nrwl/jest/generators');
    await jestProjectGenerator(host, {
      project: options.name,
      setupFile: 'angular',
      supportTsx: false,
      skipSerializers: false,
      skipPackageJson: options.skipPackageJson,
      rootProject: options.rootProject,
    });
  } else if (options.unitTestRunner === UnitTestRunner.Karma) {
    const {
      karmaProjectGenerator,
    } = require('../../../karma-project/karma-project');
    await karmaProjectGenerator(host, {
      project: options.name,
      skipFormat: true,
    });
  }
}
