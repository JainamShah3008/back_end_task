const fs = require("fs");
const path = require("path");
const date = require("date-and-time");
require("dotenv").config();

const server_mode = process.env.DEVMODE;

const { ErrorLog } = require("../models");

/**
 * This function will create a log file
 *
 * @param  {string}  fn             Function to be printed
 * @param  {Array}   errors         Data to be printed
 * @param  {string}  file_name      File's name
 * @param  {string}  folder_name    Folder name with sub path
 * @return {void}
 */
module.exports.createLogFile = async (
  fn,
  errors,
  file_name = "log_",
  folder_name = "error_logs"
) => {
  // Save log to the database
  const error_log = await ErrorLog.create({
    function: fn || null,
    folder_name: folder_name || null,
    file_name: file_name || null,
    error: errors.message || null,
    error_detail: errors.stack || null,
  });

  return true;
};
