import { useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";

const theme = createTheme({
  components: {
    MuiPagination: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          padding: "8px",
          "& .MuiPaginationItem-root": {
            color: "#000",
            backgroundColor: "#fff",
            borderColor: "#ddd",
            borderWidth: "1px",
            borderStyle: "solid",
            "&.Mui-selected": {
              backgroundColor: "#ffcccc",
              color: "#ff0000",
              borderColor: "#ff0000",
              borderWidth: "2px",
            },
            "&:hover": {
              backgroundColor: "#f0f0f0",
              borderColor: "#ff0000",
              borderWidth: "1px",
            },
          },
        },
      },
    },
  },
});

interface PokemonPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLastButtons?: boolean;
  hidePrevNextButtons?: boolean;
}

const PokemonPagination: React.FC<PokemonPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLastButtons = true,
  hidePrevNextButtons = false,
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  return (
    <ThemeProvider theme={theme}>
      <Stack
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 4 }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChange}
          showFirstButton={showFirstLastButtons}
          showLastButton={showFirstLastButtons}
          hidePrevButton={hidePrevNextButtons}
          hideNextButton={hidePrevNextButtons}
          siblingCount={1}
          boundaryCount={1}
          variant="outlined"
          color="primary"
        />
      </Stack>
    </ThemeProvider>
  );
};

PokemonPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showFirstLastButtons: PropTypes.bool,
  hidePrevNextButtons: PropTypes.bool,
};

export default PokemonPagination;
