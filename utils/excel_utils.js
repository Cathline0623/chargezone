import xlsx from "xlsx";
import path from "path";

/**
 * Scan the sheet as a matrix and find cells whose text matches any of the provided labels (case-insensitive).
 * For each found label cell, return the value of the cell immediately to its right (same row, next column).
 *
 * @param {string} filePath - Absolute or relative path to the Excel file
 * @param {string} [sheetName] - Sheet name (defaults to first sheet)
 * @param {string[]} [labels] - Array of labels to search for (e.g. ['Email','Password'])
 * @returns {Promise<Object>} mapping of label -> next-column value (labels not found are omitted)
 */
export async function getNextColumnValues(
  filePath,
  sheetName,
  labels = ["Email", "Password"]
) {
  if (!filePath) throw new Error("filePath is required");
  const absPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
  const workbook = xlsx.readFile(absPath);
  const targetSheet = sheetName || workbook.SheetNames[0];
  const sheet = workbook.Sheets[targetSheet];
  if (!sheet)
    throw new Error(`Sheet "${targetSheet}" not found in ${filePath}`);

  const matrix = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const lowerLabels = labels.map((l) => String(l).toLowerCase());
  const results = {};

  for (let r = 0; r < matrix.length; r++) {
    const row = matrix[r] || [];
    for (let c = 0; c < row.length; c++) {
      const cell = String(row[c] || "").trim();
      if (!cell) continue;
      const idx = lowerLabels.indexOf(cell.toLowerCase());
      if (idx !== -1) {
        const label = labels[idx];
        // Read the next column value in the same row
        const nextVal =
          row[c + 1] !== undefined && row[c + 1] !== null
            ? String(row[c + 1]).trim()
            : "";
        results[label] = nextVal;
        // If all labels found, return early
        const foundAll = lowerLabels.every((ll) =>
          Object.keys(results).some((k) => k.toLowerCase() === ll)
        );
        if (foundAll) return results;
      }
    }
  }

  return results;
}

export default getNextColumnValues;
