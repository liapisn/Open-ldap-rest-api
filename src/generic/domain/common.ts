export const constructOrganizationalUnits = (ous: string[]) =>
  `ou=${ous.reverse().join(",ou=")}`;
