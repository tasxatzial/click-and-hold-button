export default class KeyboardUtils {
    constructor() {}

    static getKeyName(event) {
        let pressedKey;
        if (event.key) {
            pressedKey = event.key;
        } else if (event.keyCode) {
            pressedKey = String.fromCharCode(event.keyCode);
        }
        return pressedKey;
    }

    static is_Space(event) {
        const keyName = KeyboardUtils.getKeyName(event);
        return keyName === ' ' || keyName === 'Spacebar';
    }
}
