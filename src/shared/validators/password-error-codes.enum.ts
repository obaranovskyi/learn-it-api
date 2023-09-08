export enum PasswordErrorCodes {
    ToSmall = 1,
    NoNumber = 2,
    NoSpecialCharacter = 3,
    NoCharacterInLowerCase = 4,
    NoCharacterInUpperCase = 5,
}

export namespace PasswordErrorCodes {
    export function values(): PasswordErrorCodes[] {
        return [
            PasswordErrorCodes.ToSmall,
            PasswordErrorCodes.NoNumber,
            PasswordErrorCodes.NoSpecialCharacter,
            PasswordErrorCodes.NoCharacterInUpperCase,
            PasswordErrorCodes.NoCharacterInLowerCase,
        ];
    }
}
