/**
 * @file helper.ts
 * @summary Utility functions for transforming options, status enums, and avatar helpers in TeamSync.
 * @remarks
 * Provides reusable helpers for UI and data formatting throughout the client app.
 */

/**
 * Transforms an array of option strings into objects with label, value, and optional icon.
 * @param {string[]} options - Array of option strings.
 * @param {Record<string, React.ComponentType<{ className?: string }>>} [iconMap] - Optional map of icons.
 * @returns {Array<{label: string, value: string, icon?: React.ComponentType}>}
 */
export const transformOptions = (
  options: string[],
  iconMap?: Record<string, React.ComponentType<{ className?: string }>>
) =>
  options.map((value) => ({
    label: value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    value: value,
    icon: iconMap ? iconMap[value] : undefined,
  }));

/**
 * Transforms a status enum string to a human-readable format.
 * @param {string} status - Status enum string.
 * @returns {string} Human-readable status.
 */
export const transformStatusEnum = (status: string): string => {
  return status.replace(/_/g, " ");
};

/**
 * Formats a status string to enum format (uppercase, underscores).
 * @param {string} status - Status string.
 * @returns {string} Enum format status.
 */
export const formatStatusToEnum = (status: string): string => {
  return status.toUpperCase().replace(/\s+/g, "_");
};

/**
 * Gets a color class for an avatar based on initials.
 * @param {string} initials - Initials of the user.
 * @returns {string} Tailwind color class.
 */
export const getAvatarColor = (initials: string): string => {
  const colors = [
    "bg-red-500 text-white",
    "bg-blue-500 text-white",
    "bg-green-500 text-white",
    "bg-yellow-500 text-black",
    "bg-purple-500 text-white",
    "bg-pink-500 text-white",
    "bg-teal-500 text-white",
    "bg-orange-500 text-black",
    "bg-gray-500 text-white",
  ];

  // Simple hash to map initials to a color index
  const hash = initials
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colors[hash % colors.length];
};

/**
 * Gets fallback initials for an avatar from a name string.
 * @param {string} name - Full name of the user.
 * @returns {string} Initials or 'NA' if name is empty.
 */
export const getAvatarFallbackText = (name: string) => {
  if (!name) return "NA";
  const initials = name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2); // Ensure only two initials
  return initials || "NA";
};
