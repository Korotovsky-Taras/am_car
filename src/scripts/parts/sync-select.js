class AppSyncSelect {
    constructor(syncId) {
        this.syncId = syncId;
        this.instances = new Set();
    }

    addInstance(appSelectInstance) {
        if (appSelectInstance && !this.instances.has(appSelectInstance)) {
            this.instances.add(appSelectInstance);
            appSelectInstance.syncSelectInstance = this;

            if (this.instances.size > 1) {
                const firstInstance = [...this.instances][0];
                if (firstInstance.selectedItems.size > 0) {
                    appSelectInstance.setSelectedValuesSilent([...firstInstance.selectedItems]);
                }
            }
        }
    }

    removeInstance(appSelectInstance) {
        this.instances.delete(appSelectInstance);
        if (appSelectInstance.syncSelectInstance === this) {
            appSelectInstance.syncSelectInstance = null;
        }
    }

    onChange(initiatorInstance, selectedValues) {
        this.instances.forEach(instance => {
            if (instance !== initiatorInstance) {
                const valuesToSet = instance.isMulti ? selectedValues :
                    selectedValues.length > 0 ? [selectedValues[0]] : [];

                instance.setSelectedValuesSilent(valuesToSet);
            }
        });
    }
}

window.appSyncSelectGroups = new Map();

window.getOrCreateSyncGroup = function(syncId) {
    if (!window.appSyncSelectGroups.has(syncId)) {
        window.appSyncSelectGroups.set(syncId, new AppSyncSelect(syncId));
    }
    return window.appSyncSelectGroups.get(syncId);
};

window.registerAppSelectSync = function(appSelectInstance, syncId) {
    if (!syncId || !appSelectInstance) return null;

    const syncGroup = window.getOrCreateSyncGroup(syncId);
    syncGroup.addInstance(appSelectInstance);
    return syncGroup;
};