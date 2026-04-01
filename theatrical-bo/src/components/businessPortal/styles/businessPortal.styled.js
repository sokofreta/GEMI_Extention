export const customStyles = {
  container: (provided) => ({
    ...provided,
    width: "100%",
    marginTop: 10,
  }),
  control: (provided) => ({
    ...provided,
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    borderColor: "#ccc",
    "&:hover": {
      borderColor: "#888",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    overflow: "hidden",
  }),
};
