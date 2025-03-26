import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SpeciesCard from "./SpeciesCard";
import "@testing-library/jest-dom";

// Mock species data
const mockSpecies = {
  key: 1030866,
  scientificName: "Panthera leo",
  vernacularNames: ["Lion", "African Lion"],
  rank: "SPECIES",
  kingdom: "Animalia",
  phylum: "Chordata",
  family: "Felidae",
  image: "/lion.jpg",
  compositeKey: "1030866_1_216",
  threat_status: "Vulnerable",
};

const renderWithRouter = (ui: any) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("SpeciesCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders species information correctly", () => {
    renderWithRouter(<SpeciesCard species={mockSpecies} />);

    expect(screen.getByText("Lion")).toBeInTheDocument();
    expect(screen.getByText("Panthera leo")).toBeInTheDocument();
    expect(screen.getByText("Vulnerable")).toBeInTheDocument();
    const image = screen.getByAltText("Panthera leo");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/lion.jpg");
  });

  it('displays "Unknown" when no common name is available', () => {
    const speciesWithoutCommonName = {
      ...mockSpecies,
      vernacularNames: [],
    };
    renderWithRouter(<SpeciesCard species={speciesWithoutCommonName} />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("uses placeholder image when no image is provided", () => {
    const speciesWithoutImage = {
      ...mockSpecies,
      image: undefined,
    };
    renderWithRouter(<SpeciesCard species={speciesWithoutImage} />);

    const image = screen.getByAltText("Panthera leo");
    expect(image).toHaveAttribute("src", "/placeholder.jpg");
  });

  it("creates proper link to species details page", () => {
    renderWithRouter(<SpeciesCard species={mockSpecies} />);

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/species/1030866_1_216");
  });

  it("applies correct status color based on threat_status", () => {
    renderWithRouter(<SpeciesCard species={mockSpecies} />);

    const vulnerableStatus = screen.getByText("Vulnerable");
    expect(vulnerableStatus).toHaveClass("bg-orange-500/40");

    // Cleanup is automatic here due to afterEach, so we can render again
    cleanup();
    const endangeredSpecies = {
      ...mockSpecies,
      threat_status: "Endangered",
    };
    renderWithRouter(<SpeciesCard species={endangeredSpecies} />);

    const endangeredStatus = screen.getByText("Endangered");
    expect(endangeredStatus).toHaveClass("bg-red-500/40");
  });
});
