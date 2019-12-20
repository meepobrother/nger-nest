import { ModuleMetadata, DynamicModule, ForwardReference, Type as NgerType, Provider as NestProvider } from '@nestjs/common/interfaces'
import * as nest from '@nestjs/common/interfaces'

import { ModuleOptions, Type, ModuleWithProviders, isType, Provider } from '@nger/core';
export function isNestModule(keys: string[]): boolean {
    return ['providers', `imports`, `controllers`, `exports`].some(it => keys.includes(it))
}
export type ModuleMetadataImport = NgerType<any> | DynamicModule | Promise<DynamicModule> | ForwardReference;
export function transformModuleMetadataToModuleOptions(metadata: ModuleMetadata): ModuleOptions {
    let nger: ModuleOptions = {};
    if (metadata.imports) {
        nger.imports = metadata.imports.map(it => transformModuleMetadataImportTo(it)).filter(it => !!it)
    }
    if (metadata.controllers) {
        nger.controllers = metadata.controllers;
    }
    if (metadata.exports) {
        nger.exports = metadata.exports as any;
    }
    if (metadata.providers) {
        nger.providers = metadata.providers.map(it => transformNestProviderToProvider(it))
    }
    return nger;
}
export function isNestClassProvider(val: any): val is nest.ClassProvider {
    return Reflect.has(val, 'useClass')
}

export function isNestValueProvider(val: any): val is nest.ValueProvider {
    return Reflect.has(val, 'useValue')
}

export function isFactoryProvider(val: any): val is nest.FactoryProvider {
    return Reflect.has(val, `useFactory`)
}
export function isExistingProvider(val: any): val is nest.ExistingProvider {
    return Reflect.has(val, `useExisting`)
}
export function transformNestProviderToProvider(item: NestProvider): Provider {
    if (isType(item)) return item;
    if (isNestClassProvider(item)) {
        return {
            provide: item.provide as any,
            useClass: item.useClass
        }
    }
    if (isNestValueProvider(item)) {
        return {
            provide: item.provide as any,
            useValue: item.useValue
        }
    }
    if (isFactoryProvider(item)) {
        return {
            provide: item.provide as any,
            useFactory: item.useFactory,
            deps: item.inject
        }
    }
    if (isExistingProvider(item)) {
        return {
            provide: item.provide as any,
            useExisting: item.useExisting
        }
    }
    throw new Error(`not support`)
}
export function isDynamicModule(val: any): val is DynamicModule {
    return Reflect.has(val, 'module')
}
export function transformModuleMetadataImportTo(item: ModuleMetadataImport): Type<any> | ModuleWithProviders<any> {
    if (isType(item)) return item;
    else if (isDynamicModule(item)) return transformDynamicModuleToModuleWithProviders(item)
    else {
        throw new Error(`nger not support ${item}`)
    }
}

export function transformDynamicModuleToModuleWithProviders(item: DynamicModule): ModuleWithProviders<any> {
    return {
        ngModule: item.module,
        providers: item.providers as any
    }
}

export function isNestController(keys: string[]): boolean {
    return ['path', "scope:options"].every(it => keys.includes(it))
}