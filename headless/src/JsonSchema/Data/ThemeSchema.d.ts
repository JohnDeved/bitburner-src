import type { ITheme } from "../../Themes/Themes";
/**
 * VS code has a regex for checking hex colors at: https://github.com/microsoft/vscode/blob/1dd8c77ac79508a047235ceee0cba7ba7f049425/src/vs/editor/common/languages/supports/tokenization.ts#L153.
 *
 * We have to tweak it:
 * - "#" must be the first character.
 * - Allow 3-character hex colors (e.g., #fff).
 *
 * Explanation:
^ asserts position at start of the string
# matches the character # with index 35 (base 10) literally (case sensitive)
1st Capturing Group ((([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?)|([0-9A-Fa-f]{3}))
  1st Alternative (([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?)
    2nd Capturing Group (([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?)
      3rd Capturing Group ([0-9A-Fa-f]{6})
        Match a single character present in the list below [0-9A-Fa-f]
          {6} matches the previous token exactly 6 times
          0-9 matches a single character in the range between 0 (index 48) and 9 (index 57) (case sensitive)
          A-F matches a single character in the range between A (index 65) and F (index 70) (case sensitive)
          a-f matches a single character in the range between a (index 97) and f (index 102) (case sensitive)
      4th Capturing Group ([0-9A-Fa-f]{2})?
        ? matches the previous token between zero and one times, as many times as possible, giving back as needed (greedy)
        Match a single character present in the list below [0-9A-Fa-f]
          {2} matches the previous token exactly 2 times
          0-9 matches a single character in the range between 0 (index 48) and 9 (index 57) (case sensitive)
          A-F matches a single character in the range between A (index 65) and F (index 70) (case sensitive)
          a-f matches a single character in the range between a (index 97) and f (index 102) (case sensitive)
  2nd Alternative ([0-9A-Fa-f]{3})
    5th Capturing Group ([0-9A-Fa-f]{3})
      Match a single character present in the list below [0-9A-Fa-f]
        {3} matches the previous token exactly 3 times
        0-9 matches a single character in the range between 0 (index 48) and 9 (index 57) (case sensitive)
        A-F matches a single character in the range between A (index 65) and F (index 70) (case sensitive)
        a-f matches a single character in the range between a (index 97) and f (index 102) (case sensitive)
$ asserts position at the end of the string
 */
export declare const themeHexColorRegex: RegExp;
/**
 * This regex is based on themeHexColorRegex. It removes the part of "#". When processing data of editor themes, we
 * always add "#" to the hex value, so valid hex values cannot include "#" character.
 */
export declare const editorThemeHexColorRegex: RegExp;
export declare const MainThemeSchema: {
    $schema: string;
    type: string;
    properties: Record<keyof ITheme, {
        type: string;
        pattern?: string;
    }>;
};
export declare const EditorThemeSchema: {
    $schema: string;
    type: string;
    properties: {
        common: {
            type: string;
            properties: {
                accent: {
                    type: string;
                    pattern: string;
                };
                bg: {
                    type: string;
                    pattern: string;
                };
                fg: {
                    type: string;
                    pattern: string;
                };
            };
        };
        syntax: {
            type: string;
            properties: {
                tag: {
                    type: string;
                    pattern: string;
                };
                entity: {
                    type: string;
                    pattern: string;
                };
                string: {
                    type: string;
                    pattern: string;
                };
                regexp: {
                    type: string;
                    pattern: string;
                };
                markup: {
                    type: string;
                    pattern: string;
                };
                keyword: {
                    type: string;
                    pattern: string;
                };
                comment: {
                    type: string;
                    pattern: string;
                };
                constant: {
                    type: string;
                    pattern: string;
                };
                error: {
                    type: string;
                    pattern: string;
                };
            };
        };
        ui: {
            type: string;
            properties: {
                line: {
                    type: string;
                    pattern: string;
                };
                panel: {
                    type: string;
                    properties: {
                        bg: {
                            type: string;
                            pattern: string;
                        };
                        selected: {
                            type: string;
                            pattern: string;
                        };
                        border: {
                            type: string;
                            pattern: string;
                        };
                    };
                };
                selection: {
                    type: string;
                    properties: {
                        bg: {
                            type: string;
                            pattern: string;
                        };
                    };
                };
            };
        };
        base: {
            type: string;
            /**
             * Monaco checks the base theme at runtime. If the value is invalid, monaco will throw an error ("Error: Illegal
             * theme base!") and crash the game.
             */
            enum: readonly ["vs", "vs-dark", "hc-black", "hc-light"];
        };
        inherit: {
            type: string;
        };
    };
};
