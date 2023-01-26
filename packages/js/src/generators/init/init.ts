import {
  convertNxGenerator,
  ensurePackage,
  formatFiles,
  generateFiles,
  joinPathFragments,
  Tree,
} from '@nrwl/devkit';
import * as moduleAlias from 'module-alias';
import { getRootTsConfigFileName } from '../../utils/typescript/ts-config';
import { typescriptVersion } from '../../utils/versions';
import { InitSchema } from './schema';

export async function initGenerator(
  host: Tree,
  schema: InitSchema
): Promise<void> {
  if (!schema.js) {
    await addTypescript(host);
  }

  // add tsconfig.base.json
  if (!getRootTsConfigFileName()) {
    generateFiles(host, joinPathFragments(__dirname, './files'), '.', {});
  }

  if (!schema.skipFormat) {
    await formatFiles(host);
  }
}

async function addTypescript(host: Tree) {
  await ensurePackage(host, 'typescript', typescriptVersion);
  // TODO: below is a hack to fix MODULE_NOT_FOUND for typescript, if not found, redirect to file typescript/lib/typescript.js
  try {
    require('typescript');
  } catch (err) {
    try {
      require('typescript/lib/typescript');
      moduleAlias.addAlias('typescript', 'typescript/lib/typescript');
    } catch (err) {}
  }
}

export default initGenerator;

export const initSchematic = convertNxGenerator(initGenerator);
