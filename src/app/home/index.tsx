"use client";
import unspsc_database from "../../data/unspsc_database.json" assert { type: "json" };
import * as React from "react";
import Fuse from "fuse.js";

import { accordionGroupClasses } from "@mui/joy/AccordionGroup";
import { accordionClasses } from "@mui/joy/Accordion";
import { accordionSummaryClasses } from "@mui/joy/AccordionSummary";
import { accordionDetailsClasses } from "@mui/joy/AccordionDetails";
import {
  FormControl,
  Autocomplete,
  Chip,
  Divider,
  Stack,
  Table,
  AccordionGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Avatar,
  ListItemContent,
  Select,
  Option,
  Button,
} from "@mui/joy";

import { TapAndPlayRounded, CopyAllRounded } from "@mui/icons-material";
import List from "rc-virtual-list";

type unspsc_db_item_type = {
  commodities: Record<string, string>;
  segment: string;
  segment_title: string;
  family: string;
  family_title: string;
  class: string;
  class_title: string;
};

type unspsc_data_type = {
  segment_code: string;
  segment_title: string;
  family_code: string;
  family_title: string;
  class_code: string;
  class_title: string;
  commodity_code: string;
  commodity_title: string;
};

type unspsc_data_array_type = Array<unspsc_data_type>;

const unspsc_db_arr: Array<unspsc_db_item_type> =
  Object.values(unspsc_database);

const unspsc_data: unspsc_data_array_type = unspsc_db_arr.reduce(
  (acc, item: unspsc_db_item_type): unspsc_data_array_type => [
    ...acc,
    ...Object.keys(item.commodities).map(
      (commodity_code): unspsc_data_type => ({
        segment_code: item.segment,
        segment_title: item.segment_title,
        family_code: item.family,
        family_title: item.family_title,
        class_code: item.class,
        class_title: item.class_title,
        commodity_code: commodity_code + "00",
        commodity_title: item.commodities[commodity_code],
      })
    ),
  ],
  [] as unspsc_data_array_type
);
const fuse = new Fuse(unspsc_data, {
  shouldSort: true,
  findAllMatches: true,
  threshold: 0.2,
  useExtendedSearch: true,
  keys: [
    "segment_code",
    "segment_title",
    "family_code",
    "family_title",
    "class_code",
    "class_title",
    "commodity_code",
    "commodity_title",
  ],
});

const EnginePage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [listLimit, setListLimit] = React.useState(10);
  const [expandedAccordion, setExpandedAccordion] = React.useState(0);
  const [searchResults, setSearchResults] =
    React.useState<unspsc_data_array_type>(unspsc_data.slice(0, listLimit)); // Display search results
  const rows: unspsc_data_array_type = searchResults.slice(0, listLimit);
  let timerId: NodeJS.Timeout | null = null;

  const handleLimitChange = (val: number): void => {
    console.log("Limit: ", val, searchResults.length, searchTerm);
    if (searchResults.length < val)
      setSearchResults(fuse.search(searchTerm).map((result) => result.item));
    setListLimit(Number(val));
  };

  const debounceSearch = (searchText: string, delay: number = 300) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      let results = fuse.search(searchText).map((result) => result.item);
      setSearchTerm(searchText);
      setSearchResults(results);
      // setRows(results.slice(0, listLimit)      );
    }, delay);
  };

  const copyToClipboard = async (text: string) =>
    navigator.clipboard
      .writeText(text)
      .catch((error: Error) =>
        alert("Error copying to clipboard:\n" + JSON.stringify(error))
      );

  React.useEffect(
    React.useCallback(() => {
      console.log("Rows: ", rows);
    }, [rows]),
    []
  );

  return (
    <div style={{ height: "100vh", marginTop: 0 }}>
      <h1 style={{ height: "2vh" }}>UNSPSC Search Engine</h1>
      {/* MUI Search Box */}
      <div
        className="flex justify-between"
        style={{ height: "3vh", width: "90vw", marginTop: "1rem" }}
      >
        <FormControl id="free-solo-2-demo">
          <Autocomplete
            placeholder="Search Commodities"
            type="search"
            freeSolo
            disableClearable
            options={[]}
            onInputChange={(event, value) => debounceSearch(value, 1000)}
            style={{ width: "90vw" }}
          />
        </FormControl>
      </div>

      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}></div>

      <Divider>
        <Chip variant="soft" color="neutral" size="sm">
          Results
        </Chip>
      </Divider>

      <div
        className="flex justify-between"
        style={{ marginTop: "1rem", marginBottom: "1rem" }}
      >
        <Select
          defaultValue={10}
          onChange={(e, val) => handleLimitChange(Number(val))}
          size="md"
        >
          <Option value={10}>10</Option>
          <Option value={50}>50</Option>
          <Option value={100}>100</Option>
          <Option value={150}>150</Option>
          <Option value={300}>300</Option>
          <Option value={500}>500</Option>
        </Select>
      </div>
      <div style={{ overflow: "scroll", height: "70vh" }}>
        <AccordionGroup
          variant="outlined"
          transition={{
            initial: "0.5s ease-out",
            expanded: "0.5s ease",
          }}
          sx={{
            borderRadius: "md",
            [`& .${accordionGroupClasses.root}`]: {
              marginTop: "5vw",
            },
            [`& .${accordionClasses.root}`]: {
              width: "90vw",
            },
            [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]:
              {
                paddingBlock: "1rem",
              },
            [`& .${accordionSummaryClasses.button}`]: {
              paddingBlock: "1rem",
            },
          }}
        >
          <List data={rows} itemKey="commodity_code">
            {(row: unspsc_data_type, indx: number) => (
              <Accordion
                variant="plain"
                key={row.commodity_code}
                expanded={expandedAccordion === indx}
                onChange={(e, expanded) =>
                  setExpandedAccordion(expanded ? indx : -1)
                }
              >
                <AccordionSummary>
                  <Avatar color="primary">
                    <TapAndPlayRounded />
                  </Avatar>
                  <ListItemContent>
                    <Typography level="title-md">
                      {row.commodity_title}
                    </Typography>
                    <Typography level="body-sm">
                      {row.commodity_code}
                    </Typography>
                  </ListItemContent>
                  <Button
                    onClick={() => {
                      copyToClipboard(row.commodity_code);
                    }}
                    size="md"
                    variant="plain"
                    startDecorator={<CopyAllRounded />}
                  />
                </AccordionSummary>
                <AccordionDetails variant="soft">
                  <Stack spacing={1.5}>
                    <Table borderAxis={"both"}>
                      <thead>
                        <tr>
                          <th style={{ width: "10%" }}></th>
                          <th style={{ width: "30%" }}>
                            <Typography level="title-md">Segment</Typography>
                          </th>
                          <th style={{ width: "5%" }}></th>
                          <th>
                            <Typography level="title-md">Family</Typography>
                          </th>
                          <th style={{ width: "5%" }}></th>
                          <th>
                            <Typography level="title-md">Class</Typography>
                          </th>
                          <th style={{ width: "5%" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">
                            <Typography level="title-md">Title</Typography>
                          </th>
                          <td>{row.segment_title}</td>
                          <td>
                            <Button
                              onClick={() => {
                                copyToClipboard(row.segment_title);
                              }}
                              size="md"
                              variant="plain"
                              startDecorator={<CopyAllRounded />}
                            />
                          </td>
                          <td>{row.family_title}</td>
                          <td>
                            <Button
                              onClick={() => {
                                copyToClipboard(row.family_title);
                              }}
                              size="md"
                              variant="plain"
                              startDecorator={<CopyAllRounded />}
                            />
                          </td>
                          <td>{row.class_title}</td>
                          <td>
                            <Button
                              onClick={() => {
                                copyToClipboard(row.class_title);
                              }}
                              size="md"
                              variant="plain"
                              startDecorator={<CopyAllRounded />}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <Typography level="title-md">Code</Typography>
                          </th>
                          <td>{row.segment_code}</td>
                          <td>
                            <Button
                              onClick={() => {
                                copyToClipboard(row.segment_code);
                              }}
                              size="md"
                              variant="plain"
                              startDecorator={<CopyAllRounded />}
                            />
                          </td>
                          <td>{row.family_code}</td>
                          <td>
                            <Button
                              onClick={() => {
                                copyToClipboard(row.family_code);
                              }}
                              size="md"
                              variant="plain"
                              startDecorator={<CopyAllRounded />}
                            />
                          </td>
                          <td>{row.class_code}</td>
                          <td>
                            <Button
                              onClick={() => {
                                copyToClipboard(row.class_code);
                              }}
                              size="md"
                              variant="plain"
                              startDecorator={<CopyAllRounded />}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}
          </List>
        </AccordionGroup>
      </div>
    </div>
  );
};

export default EnginePage;
