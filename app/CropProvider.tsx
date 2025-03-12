import React, { createContext, useState, useContext, ReactNode } from "react";

interface Crop {
  name: string;
  description: string;
  done: boolean;
  images: string[];
  picturesNeeded: number;
}

interface CropContextType {
  crops: Crop[];
  updateCrop: (updatedCrop: Crop) => void;
}

const CropContext = createContext<CropContextType | undefined>(undefined);

const CropProvider = ({ children }: { children: ReactNode }) => {
  const [crops, setCrops] = useState<Crop[]>([
    {
      name: "Sorgho Gen 1",
      description: "Description for Sorgho Gen 1",
      done: false,
      images: [],
      picturesNeeded: 2,
    },
    {
      name: "Sorgho Gen 2",
      description: "Description for Sorgho Gen 2",
      done: false,
      images: [],
      picturesNeeded: 5,
    },
    {
      name: "Sorgho Gen 3",
      description: "Description for Sorgho Gen 3",
      done: false,
      images: [],
      picturesNeeded: 2,
    },
    {
      name: "Maize Hybrid 1",
      description: "Description for Maize Hybrid 1",
      done: false,
      images: [],
      picturesNeeded: 4,
    },
    {
      name: "Wheat Variant A",
      description: "Description for Wheat Variant A",
      done: false,
      images: [],
      picturesNeeded: 6,
    },
  ]);

  const updateCrop = (updatedCrop: Crop) => {
    setCrops((prevCrops) =>
      prevCrops.map((crop) =>
        crop.name === updatedCrop.name ? updatedCrop : crop
      )
    );
  };

  return (
    <CropContext.Provider value={{ crops, updateCrop }}>
      {children}
    </CropContext.Provider>
  );
};

const useCrops = () => {
  const context = useContext(CropContext);
  if (!context) {
    throw new Error("useCrops must be used within a CropProvider");
  }
  return context;
};

export { CropProvider, useCrops, Crop };
