export function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const modifiedDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return modifiedDescriptor;
}
//# sourceMappingURL=autobind.js.map