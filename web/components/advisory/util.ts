export const getAdvisoryClass = (level: string) => {
  const advisoryClass =
    "flex-auto mx-auto max-w-screen-lg p-6 flex-auto rounded mt-20 border border-solid";

  switch (level) {
    case "Critical":
      return `${advisoryClass} red-600 bg-red-100 border-red-200`;
    case "Warning":
      return `${advisoryClass} amber-600 bg-amber-100 border-amber-200`;
    case "Info":
      return `${advisoryClass} green-600 bg-green-100 border-green-200`;
  }
};
