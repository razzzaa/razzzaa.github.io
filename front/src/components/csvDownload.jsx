import { CSVLink } from "react-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

function CsvFile({ countData }) {
  const headers = [
    { label: "Destination", key: "country" },
    { label: "Followers", key: "total_followers_count" },
  ];

  return (
    <>
      <CSVLink data={countData} headers={headers} filename={"followersData"}>
        <FileDownloadIcon />
        Download Data
      </CSVLink>
    </>
  );
}

export default CsvFile;
