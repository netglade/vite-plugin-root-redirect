import {Plugin} from "vite";
import path from "path";
import fsExtra from "fs-extra";
import {log as customLog} from "@/logging";
const {existsSync} = fsExtra

// We prefix the polyfill id with \0 to tell other plugins not to try to load or transform it
const SHADOW_DOM_ID = '\0shadow-dom';
const PROXY_SUFFIX = '?inject-shadow-dom-proxy';

interface shadowDomOptions {
  logging?: boolean
}

export const shadowDom = ({
  logging = false,
}: shadowDomOptions = {}): Plugin => {
  const log = logging ? customLog : () => {}

  const htmlPaths = []

  return {
    name: 'shadow-dom',
    enforce: 'pre',
    // options(options) {
    //   const entryPoints = options.input
    //   // string or dict
    //   if (entryPoints == null) {
    //
    //   } else {
    //     const newEntryPoints = {} as Record<string, string>
    //     for (const [name, path] of Object.entries(entryPoints)) {
    //       console.log(path)
    //       newEntryPoints[name] = '😌'
    //     }
    //     options.input = newEntryPoints
    //   }
    //   console.log(options)
    // },
    // buildStart() {
    //   this.emitFile({
    //     type: 'chunk',
    //     id: '123456',
    //     // type: 'asset',
    //     // fileName: 'virtual:abc.html',
    //     // source: 'fake html',
    //     // needsCodeReference: false,
    //   })
    // },
    async resolveId(source, importer, options) {
      log('resolveId', source)

      if (source === SHADOW_DOM_ID) {
        // It is important that side effects are always respected
        // for polyfills, otherwise using
        // "treeshake.moduleSideEffects: false" may prevent the
        // polyfill from being included.
        return { id: SHADOW_DOM_ID, moduleSideEffects: true };
      }
      if (options.isEntry) {

        log(`Resolving entry ${source}`)

        // Determine what the actual entry would have been. We need
        // "skipSelf" to avoid an infinite loop.
        const resolution = await this.resolve(source, importer, {
          skipSelf: true,
          ...options
        });
        // If it cannot be resolved or is external, just return it
        // so that Rollup can display an error
        if (!resolution || resolution.external) return resolution;
        // In the load hook of the proxy, we need to know if the
        // entry has a default export. There, however, we no longer
        // have the full "resolution" object that may contain
        // meta-data from other plugins that is only added on first
        // load. Therefore we trigger loading here.
        const moduleInfo = await this.load(resolution);
        // We need to make sure side effects in the original entry
        // point are respected even for
        // treeshake.moduleSideEffects: false. "moduleSideEffects"
        // is a writable property on ModuleInfo.
        moduleInfo.moduleSideEffects = true;
        // It is important that the new entry does not start with
        // \0 and has the same directory as the original one to not
        // mess up relative external import generation. Also
        // keeping the name and just adding a "?query" to the end
        // ensures that preserveModules will generate the original
        // entry name for this entry.
        return `${resolution.id}${PROXY_SUFFIX}`;
      }
      return null;
    },
    load(id) {
      if (id === SHADOW_DOM_ID) {
        console.log('load SHADOW DOM')
        // Replace with actual polyfill
        return "console.log('polyfill');";
      }
      if (id.endsWith(PROXY_SUFFIX)) {
        const entryId = id.slice(0, -PROXY_SUFFIX.length);
        // We know ModuleInfo.hasDefaultExport is reliable because
        // we awaited this.load in resolveId
        const { hasDefaultExport } = this.getModuleInfo(entryId)!;
        let code =
          `import ${JSON.stringify(SHADOW_DOM_ID)};` +
          `export * from ${JSON.stringify(entryId)};`;
        // Namespace reexports do not reexport default, so we need
        // special handling here
        if (hasDefaultExport) {
          code += `export { default } from ${JSON.stringify(entryId)};`;
        }
        return code;
      }
      return null;
    },
    renderStart(outputOptions, inputOptions) {
      let rootDir = path.dirname(Object.values(inputOptions.input)[0])
      let rootDirSuccess = true
      while (existsSync(path.join(rootDir, 'package.json')) == false && rootDirSuccess) {
        const parentDir = path.dirname(rootDir)
        if (parentDir === rootDir) {
          rootDirSuccess = false
        }
        rootDir = parentDir
      }
      if (rootDirSuccess == false) {
        return
      }
      htmlPaths.push(...Object.values(inputOptions.input).map((htmlPath) => path.join(outputOptions.dir!, path.relative(rootDir, htmlPath))))
    },
  }
}
