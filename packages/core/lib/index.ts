import { corePlatform, createPlatformFactory, InjectionToken, Type, GET_INGER_DECORATOR, StaticProvider, ControllerMetadataKey } from '@nger/core';
import { NestApplicationOptions } from '@nestjs/common';
import * as coreConstants from '@nestjs/core/constants';
import * as commonConstants from '@nestjs/common/constants';
import * as microservicesConstants from '@nestjs/microservices';

import { Reflector } from '@nestjs/core';
import { getINgerDecorator, INgerDecorator } from '@nger/decorator';
import { Module, Controller } from '@nger/core';
import { isNestModule, transformModuleMetadataToModuleOptions, isNestController } from './nests/util';
import { ModuleMetadata } from '@nestjs/common/interfaces';
export interface NestFactoryCreateOptions {
    module: any;
    port: number;
    options?: NestApplicationOptions;
}
export const NestFactoryCreateOptionsToken = new InjectionToken<NestFactoryCreateOptions>(`NestFactoryCreateOptionsToken`)
export enum NestModuleConst {
    PROVIDERS = `providers`,
    IMPORTS = "imports",
    CONTROLLERS = `controllers`,
    EXPORTS = `exports`
}
export const NestPlatformProviders: StaticProvider[] = [{
    provide: ControllerMetadataKey,
    useValue: () => { }
}, {
    provide: GET_INGER_DECORATOR,
    useValue: <T, O>(type: Type<T>): INgerDecorator<T, O> | undefined => {
        const reflector = new Reflector();
        const obj: any = {};
        Object.keys(microservicesConstants).map(key => {
            const pro = (microservicesConstants as any)[key];
            if (typeof pro === 'string') {
                const val = reflector.get(pro, type);
                if (val) Reflect.set(obj, pro, val)
            } else {
                Object.keys(pro).map(p => {
                    const k = pro[p];
                    const val = reflector.get(k, type);
                    if (val) Reflect.set(obj, k, val)
                })
            }
        })
        Object.keys(coreConstants).map(key => {
            const pro = (coreConstants as any)[key];
            if (typeof pro === 'string') {
                const val = reflector.get(pro, type);
                if (val) Reflect.set(obj, pro, val)
            } else {
                Object.keys(pro).map(p => {
                    const k = pro[p];
                    const val = reflector.get(k, type);
                    if (val) Reflect.set(obj, k, val)
                })
            }
        })
        Object.keys(commonConstants).map(key => {
            const pro = (commonConstants as any)[key];
            if (typeof pro === 'string') {
                const val = reflector.get(pro, type);
                if (val) Reflect.set(obj, pro, val)
            } else {
                Object.keys(pro).map(p => {
                    const k = pro[p];
                    const val = reflector.get(k, type);
                    if (val) Reflect.set(obj, k, val)
                })
            }
        })
        if (Reflect.get(obj, commonConstants.PARAMTYPES_METADATA)) {
            console.log(`${commonConstants.PARAMTYPES_METADATA}`)
        }
        if (Reflect.get(obj, commonConstants.SELF_DECLARED_DEPS_METADATA)) {
            console.log(`${commonConstants.SELF_DECLARED_DEPS_METADATA}`)
        }
        if (Reflect.get(obj, commonConstants.OPTIONAL_DEPS_METADATA)) {
            console.log(`${commonConstants.OPTIONAL_DEPS_METADATA}`)
        }
        // debugger;
        const keys: string[] = Reflect.getMetadataKeys(type) || [];
        if (keys.length === 0) {
            return getINgerDecorator(type);
        }
        if (isNestModule(keys)) {
            const moduleDef: ModuleMetadata = {};
            const controllers = reflector.get(commonConstants.METADATA.CONTROLLERS, type)
            const exports = reflector.get(commonConstants.METADATA.EXPORTS, type)
            const imports = reflector.get(commonConstants.METADATA.IMPORTS, type)
            const providers = reflector.get(commonConstants.METADATA.PROVIDERS, type)
            if (controllers) moduleDef.controllers = controllers;
            if (exports) moduleDef.exports = exports;
            if (imports) moduleDef.imports = imports;
            if (providers) moduleDef.providers = providers;
            const moduleOptions = transformModuleMetadataToModuleOptions(moduleDef);
            Module(moduleOptions)(type)
            return getINgerDecorator(type);
        }
        if (isNestController(keys)) {
            const path = reflector.get(commonConstants.PATH_METADATA, type)
            Controller({
                path: path!
            })(type)
            return getINgerDecorator(type);
        }

        debugger;
    }
}]
export const nestPlatform = createPlatformFactory(corePlatform, 'nest', NestPlatformProviders);
