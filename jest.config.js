/**
 * @file [jest.config]
 * @author [mzvast]
 * @email [mzvast@gmail.com']
 * @create date 2020-01-17 15:26:13
 */
/* eslint-disable max-len,babel/new-cap,operator-linebreak,fecs-export-on-declare,space-before-function-paren */
module.exports = {
    verbose: true,
    preset: 'ts-jest',
    snapshotSerializers: ['enzyme-to-json/serializer'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '/tests/.*\\.test.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    }
};
