import React from "react";
import ReactExport from "react-data-export";
import Button from "@material-ui/core/Button";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class DownloadDataButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return this.props.type == "overview" ? (
            <ExcelFile
                element={
                    <Button variant="contained" color="primary" type="submit">
                        Download Data
                    </Button>
                }
            >
                <ExcelSheet data={this.props.data} name="Overview">
                    <ExcelColumn label="Source Name" value="source_name" />
                    <ExcelColumn
                        label="Number of Requests"
                        value="number_requests"
                    />
                    <ExcelColumn label="Total Hours" value="total_hours" />
                    <ExcelColumn label="Source Name" value="source_name" />
                    <ExcelColumn
                        label="Number of Requests"
                        value="number_requests"
                    />
                    <ExcelColumn label="Total Hours" value="total_hours" />
                    <ExcelColumn
                        label="Requested Hours"
                        value="requested_hours"
                    />
                    <ExcelColumn
                        label="Commited Hours"
                        value="commited_hours"
                    />
                    <ExcelColumn label="Actual Hours" value="actual_hours" />
                    <ExcelColumn
                        label="Remaining Hours"
                        value={n =>
                            n.total_hours - n.actual_hours - n.commited_hours
                        }
                    />
                </ExcelSheet>
            </ExcelFile>
        ) : (
            <ExcelFile
                element={
                    <Button variant="contained" color="primary" type="submit">
                        Download Data
                    </Button>
                }
            >
                <ExcelSheet data={this.props.data} name="Overview">
                    <ExcelColumn label="Status" value="request_status" />
                    <ExcelColumn label="Subject" value="subject" />
                    <ExcelColumn
                        label="Busines Questions"
                        value="business_questions"
                    />
                    <ExcelColumn
                        label="Preferred Source"
                        value="preferred_source_name"
                    />
                    <ExcelColumn
                        label="Preferred Analyst"
                        value="preferred_analyst"
                    />
                    <ExcelColumn label="Total Hours" value="total_hours" />
                    <ExcelColumn
                        label="Background Report"
                        value="background_report"
                    />
                    <ExcelColumn
                        label="Severity Level"
                        value="severity_level"
                    />
                    <ExcelColumn label="Actual Hours" value="actual_hours" />
                    <ExcelColumn
                        label="Requested Hours"
                        value="requested_hours"
                    />
                    <ExcelColumn label="Deadline" value="deadline" />
                    <ExcelColumn
                        label="Commited Hours"
                        value="commited_hours"
                    />
                    <ExcelColumn label="Actual Hours" value="actual_hours" />
                </ExcelSheet>
            </ExcelFile>
        );
    }
}

export default DownloadDataButton;
