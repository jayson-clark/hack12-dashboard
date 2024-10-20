// Chakra imports
import {
  Box,
  Button,
  FormLabel,
  Icon,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import IconBox from "components/icons/IconBox";
import MiniStatistics from "components/card/MiniStatistics";
import React, { useState, useRef, useEffect } from "react";
import { MdTrendingUp, MdOutlineAnalytics, MdUpload, MdAssessment } from "react-icons/md";

import Card from "components/card/Card.js";

// Import @react-google-maps/api components
import { GoogleMap, useLoadScript, Circle, Polyline, Marker } from "@react-google-maps/api";

// Map configuration
const mapContainerStyle = {
  width: "100%",
  height: "100%", // Set height to fill the available space
  borderRadius: "15px", // Added rounded corners
};

const center = {
  lat: 29.77, // Updated center to better represent the average of circles
  lng: -95.36,
};

// Function to generate random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Hurricane Harvey path coordinates
const hurricanePath = [
  { lat: 13.4, lng: -52 },
  { lat: 13.1, lng: -53.4 },
  { lat: 13.0, lng: -55 },
  { lat: 13.0, lng: -56.6 },
  { lat: 13.0, lng: -58.4 },
  { lat: 13.1, lng: -59.6 },
  { lat: 13.1, lng: -60.3 },
  { lat: 13.2, lng: -61.2 },
  { lat: 13.2, lng: -62.2 },
  { lat: 13.4, lng: -64 },
  { lat: 13.5, lng: -65.7 },
  { lat: 13.7, lng: -67.5 },
  { lat: 21.4, lng: -92.3 },
  { lat: 21.6, lng: -92.4 },
  { lat: 22.0, lng: -92.5 },
  { lat: 22.8, lng: -92.6 },
  { lat: 23.7, lng: -93.1 },
  { lat: 24.4, lng: -93.6 },
  { lat: 25.0, lng: -94.4 },
  { lat: 25.6, lng: -95.1 },
  { lat: 26.3, lng: -95.8 },
  { lat: 27.1, lng: -96.3 },
  { lat: 27.8, lng: -96.8 },
  { lat: 28.0, lng: -96.9 },
  { lat: 28.2, lng: -97.1 },
  { lat: 28.7, lng: -97.3 },
  { lat: 29.0, lng: -97.5 },
  { lat: 29.2, lng: -97.4 },
  { lat: 29.3, lng: -97.6 },
  { lat: 29.1, lng: -97.5 },
  { lat: 29.0, lng: -97.2 },
  { lat: 28.8, lng: -96.8 },
  { lat: 28.6, lng: -96.5 },
  { lat: 28.5, lng: -96.2 },
  { lat: 28.4, lng: -95.9 },
  { lat: 28.2, lng: -95.4 },
  { lat: 28.1, lng: -95 },
  { lat: 28.2, lng: -94.6 },
  { lat: 28.5, lng: -94.2 },
  { lat: 28.9, lng: -93.8 },
  { lat: 29.4, lng: -93.6 },
  { lat: 29.8, lng: -93.5 },
  { lat: 30.1, lng: -93.4 },
  { lat: 30.6, lng: -93.1 },
  { lat: 31.3, lng: -92.6 },
  { lat: 31.9, lng: -92.2 },
  { lat: 32.5, lng: -91.7 },
  { lat: 33.4, lng: -90.9 },
  { lat: 34.1, lng: -89.6 },
];

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  // State for uploaded images
  const [images, setImages] = useState([]);

  const [circleRankings, setCircleRankings] = useState(
    [
      {
        "center": { "lat": 29.922398, "lng": -95.708702 },
        "radius": 12000 / 5, // 1/5 of original radius
        "averageDamageCost": "$48,000",
        "totalDamageCost": "$1,152,000",
        "numberOfProperties": 24,
      },
      {
        "center": { "lat": 29.888085, "lng": -95.697472 },
        "radius": 13000 / 5, // 1/5 of original radius
        "averageDamageCost": "$52,000",
        "totalDamageCost": "$1,300,000",
        "numberOfProperties": 25,
      },
      {
        "center": { "lat": 29.596714, "lng": -95.235756 },
        "radius": 11000 / 5, // 1/5 of original radius
        "averageDamageCost": "$49,500",
        "totalDamageCost": "$1,237,500",
        "numberOfProperties": 25,
      },
      {
        "center": { "lat": 28.818680, "lng": -96.983347 },
        "radius": 14000 / 5, // 1/5 of original radius
        "averageDamageCost": "$55,000",
        "totalDamageCost": "$1,375,000",
        "numberOfProperties": 25,
      },
      {
        "center": { "lat": 30.078328, "lng": -94.146564 },
        "radius": 15000 / 5, // 1/5 of original radius
        "averageDamageCost": "$51,000",
        "totalDamageCost": "$1,275,000",
        "numberOfProperties": 25,
      },
      {
        "center": { "lat": 29.871399, "lng": -95.295613 },
        "radius": 13000 / 5, // 1/5 of original radius
        "averageDamageCost": "$47,000",
        "totalDamageCost": "$1,172,000",
        "numberOfProperties": 22,
      },
    ].map((circle) => ({ ...circle, color: getRandomColor() }))
  );

  const [selectedCircles, setSelectedCircles] = useState([]);

  // State for statistics
  const [totalDamageCost, setTotalDamageCost] = useState(185000);
  const [totalSamplesAnalyzed, setTotalSamplesAnalyzed] = useState(95);
  const [totalAffectedAreas, setTotalAffectedAreas] = useState(3);

  // Placeholder function to process sample and update statistics
  const processSample = (file) => {
    console.log("Processing sample: ", file.name);
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setImages((prevImages) => [...prevImages, ...imageUrls]);

      // Randomly assign images to regions and update data accordingly
      const updatedCircleRankings = [...circleRankings];
      files.forEach((file) => {
        const randomIndex = Math.floor(Math.random() * updatedCircleRankings.length);
        const region = updatedCircleRankings[randomIndex];

        // Update the number of properties (samples) in the region
        region.numberOfProperties += 1;

        // Update the total damage cost for the region
        const additionalDamageCost = Math.floor(Math.random() * 50000) + 20000; // Random damage cost between $20,000 and $70,000
        const newTotalDamageCost = parseInt(region.totalDamageCost.replace(/\D/g, "")) + additionalDamageCost;
        region.totalDamageCost = `$${newTotalDamageCost.toLocaleString()}`;

        // Update the average damage cost
        region.averageDamageCost = `$${Math.round(newTotalDamageCost / region.numberOfProperties).toLocaleString()}`;
      });

      setCircleRankings(updatedCircleRankings);

      // Update overall statistics
      const additionalTotalDamage = files.reduce((sum) => sum + Math.floor(Math.random() * 50000) + 20000, 0);
      setTotalSamplesAnalyzed((prev) => prev + files.length);
      setTotalDamageCost((prev) => prev + additionalTotalDamage);
      setTotalAffectedAreas(updatedCircleRankings.filter((region) => region.numberOfProperties > 0).length);
    }
  };

  const fileInputRef = useRef(null);

  // Function to handle the click of the custom button
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden input
  };

  // Load Google Maps Script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyByJS1l2S-tY0k-KAWRe5ljrDf9u-leyeg", // Replace with your API key
    libraries: ["drawing", "places"],
  });

  useEffect(() => {
    // Automatically select all circles when the page loads
    setSelectedCircles(circleRankings.map((_, index) => index));
  }, [circleRankings]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  const handleRowClick = (index) => {
    setSelectedCircles((prev) => {
      const isSelected = prev.includes(index);
      if (isSelected) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} maxW="100vw" w="100%" h="100vh" overflowX="hidden">
      <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px" mb="20px" h="calc(100% - 130px)">
        <Box w="100%" h="100%">
          {/* Statistics and Image Upload */}
          <input type="file" id="file-input" onChange={handleImageUpload} ref={fileInputRef} multiple hidden />
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px" mb="20px">
            <MiniStatistics
              startContent={
                <IconBox w="56px" h="56px" bg={boxBg} icon={<Icon w="32px" h="32px" as={MdTrendingUp} color={brandColor} />} />
              }
              name="Total Damage Cost"
              value={<span>${totalDamageCost.toLocaleString()}</span>}
            />
            <MiniStatistics
              startContent={
                <IconBox w="56px" h="56px" bg={boxBg} icon={<Icon w="32px" h="32px" as={MdOutlineAnalytics} color={brandColor} />} />
              }
              name="Total Number of Samples Analyzed"
              value={<span>{totalSamplesAnalyzed}</span>}
            />
            <MiniStatistics
              startContent={
                <IconBox w="56px" h="56px" bg={boxBg} icon={<Icon w="32px" h="32px" as={MdAssessment} color={brandColor} />} />
              }
              name="Total Affected Regions"
              value={<span>{totalAffectedAreas}</span>}
            />
            <Button
              size="lg"
              height="100%" // Set button height to match MiniStatistics widgets
              leftIcon={<MdUpload />}
              colorScheme="teal"
              onClick={handleButtonClick}
            >
              Upload Samples
            </Button>
          </SimpleGrid>

          {/* Ranking of Polygons */}
          <Card w="100%" h="calc(100% - 200px)" mt="20px">
            <FormLabel fontWeight="bold">Highly Affected Areas</FormLabel>
            <Box h="calc(100% - 50px)" overflowY="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Select</Th>
                    <Th>Average Damage Cost</Th>
                    <Th>Total Damage Cost</Th>
                    <Th>Number of Samples</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {circleRankings.map((polygon, index) => (
                    <Tr key={index} onClick={() => handleRowClick(index)} style={{ cursor: "pointer" }}>
                      <Td>
                        <input
                          type="checkbox"
                          id={`circle-${index}`}
                          checked={selectedCircles.includes(index)}
                          onChange={() => handleRowClick(index)}
                          style={{ accentColor: polygon.color, width: "20px", height: "20px" }}
                        />
                      </Td>
                      <Td>{polygon.averageDamageCost}</Td>
                      <Td>{polygon.totalDamageCost}</Td>
                      <Td>{polygon.numberOfProperties}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Card>
        </Box>

        {/* Google Map */}
        <Box w="100%" h="100%">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={8}
            options={{
              disableDefaultUI: true, // Remove default UI elements
              mapTypeId: "satellite", // Set map to satellite view
            }}
          >
            {selectedCircles.map((index) => (
              <Circle
                key={index}
                center={circleRankings[index].center}
                radius={circleRankings[index].radius}
                options={{
                  fillColor: circleRankings[index].color,
                  fillOpacity: 0.4,
                  strokeColor: circleRankings[index].color,
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  clickable: true,
                  draggable: false,
                  editable: false,
                  geodesic: false,
                  zIndex: 1,
                }}
              />
            ))}

            {/* Hurricane Path */}
            <Polyline
              path={hurricanePath}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 3,
              }}
            />
            {hurricanePath.map((point, index) => (
              <Marker
                key={index}
                position={point}
                options={{
                  icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 4,
                    fillColor: "#00FF00",
                    fillOpacity: 1,
                    strokeWeight: 0,
                  },
                }}
              />
            ))}
          </GoogleMap>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

