# Masters Module Breakdown

## Masters Shell

- **Route:** `/masters`
- **Shell component:** `src/app/features/masters/masters-shell/masters-shell.component.ts`
- **Child routes:** `users`, `drivers`, `pickers`, `stores`, `dispatch-managers`
- **Purpose:** Administrative data management hub for master records.

## Users Master

- **Route:** `/masters/users`
- **Component:** `src/app/features/masters/user-list/user-list.component.ts`
- **Purpose:** Maintain user records and activation state.
- **API touchpoints:** `getUsers`, `addUser`, `updateUser`

## Drivers Master

- **Route:** `/masters/drivers`
- **Component:** `src/app/features/masters/driver-list/driver-list.component.ts`
- **Purpose:** Maintain driver roster and contact/vehicle details.
- **API touchpoints:** `getDrivers`, `addDriver`, `updateDriver`

## Pickers Master

- **Route:** `/masters/pickers`
- **Component:** `src/app/features/masters/picker-list/picker-list-master.component.ts`
- **Purpose:** Maintain picker master records.
- **API touchpoints:** `getPickers`, `addPicker`, `updatePicker`

## Stores Master

- **Route:** `/masters/stores`
- **Component:** `src/app/features/masters/store-list/store-list.component.ts`
- **Purpose:** Maintain outlet/store master records.
- **API touchpoints:** `getOutlets`, `addOutlet`, `updateOutlet`

## Dispatch Managers Master

- **Route:** `/masters/dispatch-managers`
- **Component:** `src/app/features/masters/dispatch-manager-list/dispatch-manager-list.component.ts`
- **Purpose:** Maintain dispatch manager user records.
- **API touchpoints:** `getDispatchManagers`, `addDispatchManager`, `updateDispatchManager`

## Cross-Module Notes

- Master data directly drives operations modules:
  - Drivers are used in dispatch assignment and tracking.
  - Stores/outlets are used in allocation, dispatch, reporting, and receiving.
  - Pickers and users support workforce and permission-ready setup.

