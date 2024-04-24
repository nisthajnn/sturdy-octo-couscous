import React from 'react';
import { Container, Table } from '@mantine/core';
import data from './Manufac _ India Agro Dataset.json';
import './style.css';

// Define types for the aggregated data object
interface AggregatedData {
  [year: string]: {
    maxProduction: number;
    maxCrop: string;
    minProduction: number;
    minCrop: string;
  };
}

// Define a type for crop data with an index signature
type CropData = {
  [key: string]: {
    totalYield: number;
    totalArea: number;
    count: number;
  };
};

const App = () => {
  // Aggregate data by year
  const aggregatedData: AggregatedData = data.reduce((acc: AggregatedData, curr: any) => {
    const year = curr.Year.split(',')[1].trim(); // Extracting year from "Financial Year (Apr - Mar), 1950"
    const cropName = curr['Crop Name'];
    const production = curr['Crop Production (UOM:t(Tonnes))'] || 0;

    if (!acc[year]) {
      acc[year] = { maxProduction: 0, maxCrop: '', minProduction: Infinity, minCrop: '' };
    }

    if (production > acc[year].maxProduction) {
      acc[year].maxProduction = production;
      acc[year].maxCrop = cropName;
    }

    if (production < acc[year].minProduction) {
      acc[year].minProduction = production;
      acc[year].minCrop = cropName;
    }

    return acc;
  }, {});

  // Convert aggregated data into an array of objects
  const tableData = Object.entries(aggregatedData).map(([year, { maxCrop, minCrop }]) => ({
    Year: year,
    'Crop with Maximum Production': maxCrop,
    'Crop with Minimum Production': minCrop,
  }));

  // Define the type for the value parameter
  const handleMissingValues = (value: any) => (value ? value : 0);

  // Initialize cropData with the defined type
  const cropData: CropData = {};

  // Aggregate data for each crop
  data.forEach((item: any) => {
    const cropName = item['Crop Name'];

    // Initialize or update values for the crop
    cropData[cropName] = {
      totalYield: (cropData[cropName]?.totalYield || 0) + handleMissingValues(item['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))']),
      totalArea: (cropData[cropName]?.totalArea || 0) + handleMissingValues(item['Area Under Cultivation (UOM:Ha(Hectares))']),
      count: (cropData[cropName]?.count || 0) + 1,
    };
  });

  // Calculate average yield and average area for each crop
  const cropAverages = Object.keys(cropData).map((cropName) => ({
    cropName,
    averageYield: cropData[cropName].totalYield / cropData[cropName].count,
    averageArea: cropData[cropName].totalArea / cropData[cropName].count,
  }));

  return (
    <Container size="sm" className="table-container">
      <h1 style={{ textAlign: 'center' }}>Indian Agriculture Dataset Analysis</h1>
      <div style={{ display: 'flex', gap: '50px' }}>
        <div style={{ flex: 1 }}>
          <Table striped>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Year</th>
                <th style={{ textAlign: 'center' }}>Crop with Maximum Production in that year</th>
                <th style={{ textAlign: 'center' }}>Crop with Minimum Production in that year</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center' }}>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.Year}</td>
                  <td>{row['Crop with Maximum Production']}</td>
                  <td>{row['Crop with Minimum Production']}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div style={{ flex: 1 }}>
          
          <Table>
            <thead>
              <tr >
                <th style={{ textAlign: 'center' }}>Crop</th>
                <th style={{ textAlign: 'center' }}>Average Yield of the crop between 1915-2020</th>
                <th style={{ textAlign: 'center' }}>Average Cultivation Areaof the Crop between 1950-2020</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center' }}>
              {cropAverages.map((crop, index) => (
                <tr key={index}>
                  <td>{crop.cropName}</td>
                  <td>{crop.averageYield.toFixed(3)}</td>
                  <td>{crop.averageArea.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
};

export default App;
