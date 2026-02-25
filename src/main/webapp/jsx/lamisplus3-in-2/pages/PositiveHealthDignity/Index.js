// import React, { useState } from "react";
// import axios from "axios";
// import { Input } from "reactstrap";
// import * as moment from "moment";
// import { Typography, Box, IconButton, Tooltip } from "@mui/material";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
// import { makeStyles } from "@material-ui/core/styles";
// import { Card, CardContent } from "@material-ui/core";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { token, url as baseUrl } from "../../../../api";
// import MatButton from "@material-ui/core/Button";
// import SaveIcon from "@material-ui/icons/Save";
// import CancelIcon from "@material-ui/icons/Cancel";
//
// // ─────────────────────────────────────────────────────────────────────────────
// // Constants
// // ─────────────────────────────────────────────────────────────────────────────
//
// const PHD_SERVICES = [
//   {
//     key: "adherence_counseling",
//     label: "Adherence counseling",
//   },
//   {
//     key: "hiv_education_nutrition",
//     label: "Basic HIV education and transmission including nutrition",
//   },
//   {
//     key: "prevention_counselling",
//     label: "Prevention counselling: abstinence, safer sex, household precautions",
//   },
//   {
//     key: "disclosure_partner_testing",
//     label: "Disclosure, partner testing and counseling, family situation",
//   },
//   {
//     key: "condom_provision",
//     label: "Condom provision",
//   },
//   {
//     key: "sti_screening",
//     label: "STI screening, diagnosis and referral for management",
//   },
//   {
//     key: "rh_fp_services",
//     label: "Provision/referral for RH/FP services",
//   },
//   {
//     key: "substance_use_counseling",
//     label: "Alcohol & other substance use risk reduction counseling",
//   },
//   {
//     key: "palliative_care",
//     label: "Symptom management and palliative care at home",
//   },
//   {
//     key: "positive_living",
//     label: "Positive living counselling",
//   },
//   {
//     key: "support_group",
//     label: "Support group enrollment, community support, clinic contacts",
//   },
//   {
//     key: "mental_health_screening",
//     label: "Mental Health Screening",
//   },
// ];
//
// // ─────────────────────────────────────────────────────────────────────────────
// // Styles
// // ─────────────────────────────────────────────────────────────────────────────
//
// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
//     "& .form-control": { borderRadius: "0.25rem", height: "41px" },
//   },
//   button: { margin: theme.spacing(1) },
// }));
//
// // ─────────────────────────────────────────────────────────────────────────────
// // Component
// // ─────────────────────────────────────────────────────────────────────────────
//
// const PositiveHealthDignityForm = (props) => {
//   const classes = useStyles();
//   const today = moment(new Date()).format("YYYY-MM-DD");
//
//   const [saving, setSaving] = useState(false);
//
//   // Per-service state: { dates: [""], comment: "" }
//   const [services, setServices] = useState(() =>
//     Object.fromEntries(
//       PHD_SERVICES.map((s) => [s.key, { dates: [""], comment: "" }])
//     )
//   );
//
//   // ── Date helpers ──────────────────────────────────────────────────────────
//
//   const addDate = (key) => {
//     setServices((prev) => ({
//       ...prev,
//       [key]: { ...prev[key], dates: [...prev[key].dates, ""] },
//     }));
//   };
//
//   const removeDate = (key, idx) => {
//     setServices((prev) => {
//       const updated = prev[key].dates.filter((_, i) => i !== idx);
//       return {
//         ...prev,
//         [key]: { ...prev[key], dates: updated.length > 0 ? updated : [""] },
//       };
//     });
//   };
//
//   const updateDate = (key, idx, value) => {
//     setServices((prev) => {
//       const updated = [...prev[key].dates];
//       updated[idx] = value;
//       return { ...prev, [key]: { ...prev[key], dates: updated } };
//     });
//   };
//
//   const updateComment = (key, value) => {
//     setServices((prev) => ({
//       ...prev,
//       [key]: { ...prev[key], comment: value },
//     }));
//   };
//
//   // ── Observation date — earliest filled date or today ─────────────────────
//
//   const getObservationDate = () => {
//     for (const svc of PHD_SERVICES) {
//       const filled = services[svc.key].dates.filter(Boolean);
//       if (filled.length > 0) return filled[0];
//     }
//     return today;
//   };
//
//   // ── Validation ────────────────────────────────────────────────────────────
//
//   const validate = () => {
//     const anyFilled = PHD_SERVICES.some((svc) =>
//       services[svc.key].dates.some(Boolean)
//     );
//     if (!anyFilled) {
//       toast.error("Please record at least one service date.");
//       return false;
//     }
//     return true;
//   };
//
//   // ── Submit ────────────────────────────────────────────────────────────────
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setSaving(true);
//     try {
//       const payload = {
//         dateOfObservation: getObservationDate(),
//         personId: props.patientObj.id,
//         type: "Care and Support/Positive Health Dignity and Prevention Services",
//         data: {
//           services: PHD_SERVICES.map((svc) => ({
//             service: svc.key,
//             label: svc.label,
//             dates: services[svc.key].dates.filter(Boolean),
//             comment: services[svc.key].comment,
//           })),
//         },
//       };
//       await axios.post(`${baseUrl}observation`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Positive Health Dignity record saved successfully");
//       props.setActiveContent({ ...props.activeContent, route: "recent-history" });
//     } catch (err) {
//       const msg =
//         err?.response?.data?.apierror?.message ||
//         "An error occurred. Please try again.";
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };
//
//   // ─────────────────────────────────────────────────────────────────────────
//   // Render
//   // ─────────────────────────────────────────────────────────────────────────
//
//   return (
//     <Card
//       className={classes.root}
//       style={{ borderRadius: "12px", overflow: "visible" }}
//     >
//       <CardContent>
//
//         {/* ── Header ──────────────────────────────────────────────────────── */}
//         <Box sx={{ backgroundColor: "#014d88", padding: "14px 20px", marginBottom: "24px" }}>
//           <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
//             Care and Support / Positive Health Dignity and Prevention Services
//           </Typography>
//         </Box>
//
//         <form onSubmit={handleSubmit}>
//
//           {/* ── Service Table ─────────────────────────────────────────────── */}
//           <div style={{ overflowX: "auto", marginBottom: "20px" }}>
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 fontSize: "13px",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                 borderRadius: "8px",
//                 overflow: "hidden",
//               }}
//             >
//               <thead>
//                 <tr style={{ background: "#014d88", color: "#fff" }}>
//                   <th
//                     style={{
//                       padding: "12px 18px",
//                       textAlign: "left",
//                       width: "32%",
//                       fontWeight: 700,
//                       fontSize: "13px",
//                     }}
//                   >
//                     Services
//                     <div
//                       style={{
//                         fontSize: "11px",
//                         fontWeight: 400,
//                         color: "#c8e6c9",
//                         marginTop: "3px",
//                       }}
//                     >
//                       (Indicate &apos;X&apos; if service provided on date)
//                     </div>
//                   </th>
//                   <th
//                     style={{
//                       padding: "12px 18px",
//                       textAlign: "left",
//                       width: "52%",
//                       fontWeight: 600,
//                       fontSize: "13px",
//                     }}
//                   >
//                     Dates Provided
//                     <div
//                       style={{
//                         fontSize: "11px",
//                         fontWeight: 400,
//                         color: "#c8e6c9",
//                         marginTop: "3px",
//                       }}
//                     >
//                       Click + to add more dates
//                     </div>
//                   </th>
//                   <th
//                     style={{
//                       padding: "12px 18px",
//                       textAlign: "left",
//                       width: "16%",
//                       fontWeight: 600,
//                       fontSize: "13px",
//                     }}
//                   >
//                     Comment
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {PHD_SERVICES.map((svc, i) => (
//                   <tr
//                     key={svc.key}
//                     style={{
//                       background: i % 2 === 0 ? "#f5f9ff" : "#ffffff",
//                       borderBottom: "1px solid #dce8f5",
//                       verticalAlign: "top",
//                     }}
//                   >
//                     {/* Service label */}
//                     <td
//                       style={{
//                         padding: "12px 18px",
//                         color: "#333",
//                         fontWeight: "500",
//                         lineHeight: "1.45",
//                       }}
//                     >
//                       {svc.label}
//                     </td>
//
//                     {/* Dates */}
//                     <td style={{ padding: "8px 12px" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           flexWrap: "wrap",
//                           gap: "6px",
//                           alignItems: "center",
//                         }}
//                       >
//                         {services[svc.key].dates.map((d, idx) => (
//                           <div
//                             key={idx}
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: "2px",
//                             }}
//                           >
//                             <Input
//                               type="date"
//                               value={d}
//                               max={today}
//                               onChange={(e) =>
//                                 updateDate(svc.key, idx, e.target.value)
//                               }
//                               style={{
//                                 fontSize: "12px",
//                                 padding: "3px 6px",
//                                 height: "32px",
//                                 width: "146px",
//                               }}
//                             />
//                             {services[svc.key].dates.length > 1 && (
//                               <Tooltip title="Remove this date">
//                                 <IconButton
//                                   size="small"
//                                   onClick={() => removeDate(svc.key, idx)}
//                                   style={{ color: "#992E62", padding: "2px" }}
//                                 >
//                                   <RemoveCircleOutlineIcon
//                                     style={{ fontSize: "18px" }}
//                                   />
//                                 </IconButton>
//                               </Tooltip>
//                             )}
//                           </div>
//                         ))}
//
//                         {/* Add date button */}
//                         <Tooltip title="Add another date">
//                           <IconButton
//                             size="small"
//                             onClick={() => addDate(svc.key)}
//                             style={{ color: "#014d88", padding: "2px" }}
//                           >
//                             <AddCircleOutlineIcon style={{ fontSize: "20px" }} />
//                           </IconButton>
//                         </Tooltip>
//                       </div>
//                     </td>
//
//                     {/* Comment */}
//                     <td style={{ padding: "8px 12px" }}>
//                       <Input
//                         type="textarea"
//                         value={services[svc.key].comment}
//                         onChange={(e) => updateComment(svc.key, e.target.value)}
//                         rows={2}
//                         placeholder="Comment..."
//                         style={{
//                           fontSize: "12px",
//                           height: "auto",
//                           minHeight: "44px",
//                           resize: "vertical",
//                         }}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//
//           {/* ── Action Buttons ────────────────────────────────────────────── */}
//           <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid #e0e0e0", marginTop: "8px" }}>
//             <MatButton
//               variant="contained"
//               className={classes.button}
//               startIcon={<CancelIcon style={{ color: "#fff" }} />}
//               style={{ backgroundColor: "#992E62" }}
//               onClick={() => props.setActiveContent({ ...props.activeContent, route: "recent-history" })}
//             >
//               <span style={{ textTransform: "capitalize" }}>Cancel</span>
//             </MatButton>
//             <MatButton
//               type="submit"
//               variant="contained"
//               className={classes.button}
//               startIcon={<SaveIcon />}
//               style={{ backgroundColor: "#014d88" }}
//               disabled={saving}
//             >
//               <span style={{ textTransform: "capitalize" }}>{saving ? "Saving..." : "Save"}</span>
//             </MatButton>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };
//
// export default PositiveHealthDignityForm;


import React, { useState } from "react";
import axios from "axios";
import { Input } from "reactstrap";
import * as moment from "moment";
import { Typography, Box, Checkbox, FormControlLabel } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { token, url as baseUrl } from "../../../../api";
import MatButton from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const PHD_SERVICES = [
  {
    key: "adherence_counseling",
    label: "Adherence counseling",
  },
  {
    key: "hiv_education_nutrition",
    label: "Basic HIV education and transmission including nutrition",
  },
  {
    key: "prevention_counselling",
    label: "Prevention counselling: abstinence, safer sex, household precautions",
  },
  {
    key: "disclosure_partner_testing",
    label: "Disclosure, partner testing and counseling, family situation",
  },
  {
    key: "condom_provision",
    label: "Condom provision",
  },
  {
    key: "sti_screening",
    label: "STI screening, diagnosis and referral for management",
  },
  {
    key: "rh_fp_services",
    label: "Provision/referral for RH/FP services",
  },
  {
    key: "substance_use_counseling",
    label: "Alcohol & other substance use risk reduction counseling",
  },
  {
    key: "palliative_care",
    label: "Symptom management and palliative care at home",
  },
  {
    key: "positive_living",
    label: "Positive living counselling",
  },
  {
    key: "support_group",
    label: "Support group enrollment, community support, clinic contacts",
  },
  {
    key: "mental_health_screening",
    label: "Mental Health Screening",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const useStyles = makeStyles((theme) => ({
  root: {
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
    "& .form-control": { borderRadius: "0.25rem", height: "41px" },
  },
  button: { margin: theme.spacing(1) },
  commentTextArea: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "80px",
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const PositiveHealthDignityForm = (props) => {
  const classes = useStyles();
  const today = moment(new Date()).format("YYYY-MM-DD");

  const [saving, setSaving] = useState(false);
  const [serviceDate, setServiceDate] = useState(today);
  const [selectedServices, setSelectedServices] = useState(
      Object.fromEntries(PHD_SERVICES.map((s) => [s.key, false]))
  );
  const [globalComment, setGlobalComment] = useState("");

  // ── Service toggle handler ────────────────────────────────────────────────
  const toggleService = (key) => {
    setSelectedServices((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const anyChecked = Object.values(selectedServices).some((v) => v);
    if (!anyChecked) {
      toast.error("Please select at least one service provided on this date.");
      return false;
    }
    if (!serviceDate) {
      toast.error("Please select a valid service date.");
      return false;
    }
    return true;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        dateOfObservation: serviceDate,
        personId: props.patientObj.id,
        type: "Care and Support/Positive Health Dignity and Prevention Services",
        data: {
          services: PHD_SERVICES.map((svc) => ({
            service: svc.key,
            label: svc.label,
            // Send single date if service was provided, empty array otherwise
            dates: selectedServices[svc.key] ? [serviceDate] : [],
            comment: "", // Per-service comments removed per requirements
          })),
          encounterComment: globalComment.trim() || null, // Global comment field
        },
      };

      await axios.post(`${baseUrl}observation`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Positive Health Dignity record saved successfully");
      props.setActiveContent({ ...props.activeContent, route: "recent-history" });
    } catch (err) {
      const msg =
          err?.response?.data?.apierror?.message ||
          "An error occurred. Please try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
      <Card
          className={classes.root}
          style={{ borderRadius: "12px", overflow: "visible" }}
      >
        <CardContent>
          {/* ── Header ──────────────────────────────────────────────────────── */}
          <Box sx={{ backgroundColor: "#014d88", padding: "14px 20px", marginBottom: "24px" }}>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
              Care and Support / Positive Health Dignity and Prevention Services
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* ── Service Date Picker ─────────────────────────────────────────── */}
            <Box sx={{ marginBottom: "24px" }}>
              <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#014d88",
                    fontWeight: 600,
                    marginBottom: "8px",
                    display: "block"
                  }}
              >
                Service Date *
              </Typography>
              <Input
                  type="date"
                  value={serviceDate}
                  max={today}
                  onChange={(e) => setServiceDate(e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: "220px",
                    fontSize: "14px",
                    height: "40px",
                    padding: "0 8px"
                  }}
              />
              <Typography
                  variant="caption"
                  sx={{
                    color: "#666",
                    display: "block",
                    marginTop: "4px",
                    fontStyle: "italic"
                  }}
              >
                Select the date when services were provided
              </Typography>
            </Box>

            {/* ── Service Table ─────────────────────────────────────────────── */}
            <div style={{ overflowX: "auto", marginBottom: "24px" }}>
              <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
              >
                <thead>
                <tr style={{ background: "#014d88", color: "#fff" }}>
                  <th
                      style={{
                        padding: "12px 18px",
                        textAlign: "left",
                        width: "70%",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                  >
                    Services
                  </th>
                  <th
                      style={{
                        padding: "12px 18px",
                        textAlign: "center",
                        width: "30%",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                  >
                    Provided?
                  </th>
                </tr>
                </thead>
                <tbody>
                {PHD_SERVICES.map((svc, i) => (
                    <tr
                        key={svc.key}
                        style={{
                          background: i % 2 === 0 ? "#f5f9ff" : "#ffffff",
                          borderBottom: "1px solid #dce8f5",
                        }}
                    >
                      {/* Service label */}
                      <td
                          style={{
                            padding: "14px 18px",
                            color: "#333",
                            fontWeight: "500",
                            lineHeight: "1.45",
                          }}
                      >
                        {svc.label}
                      </td>

                      {/* Checkbox */}
                      <td style={{ padding: "14px 18px", textAlign: "center" }}>
                        <Checkbox
                            checked={!!selectedServices[svc.key]}
                            onChange={() => toggleService(svc.key)}
                            style={{ padding: "4px" }}
                            color="primary"
                        />
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>

            {/* ── Global Comments Section ─────────────────────────────────────── */}
            <Box sx={{ marginBottom: "28px" }}>
              <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#014d88",
                    fontWeight: 600,
                    marginBottom: "10px",
                    fontSize: "14px"
                  }}
              >
                Additional Comments (Optional)
              </Typography>
              <textarea
                  value={globalComment}
                  onChange={(e) => setGlobalComment(e.target.value)}
                  placeholder="Enter any additional notes about services provided on this date..."
                  className={classes.commentTextArea}
              />
            </Box>

            {/* ── Action Buttons ────────────────────────────────────────────── */}
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid #e0e0e0" }}>
              <MatButton
                  variant="contained"
                  className={classes.button}
                  startIcon={<CancelIcon style={{ color: "#fff" }} />}
                  style={{ backgroundColor: "#992E62" }}
                  onClick={() => props.setActiveContent({ ...props.activeContent, route: "recent-history" })}
              >
                <span style={{ textTransform: "capitalize" }}>Cancel</span>
              </MatButton>
              <MatButton
                  type="submit"
                  variant="contained"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                  style={{ backgroundColor: "#014d88" }}
                  disabled={saving}
              >
                <span style={{ textTransform: "capitalize" }}>{saving ? "Saving..." : "Save"}</span>
              </MatButton>
            </div>
          </form>
        </CardContent>
      </Card>
  );
};

export default PositiveHealthDignityForm;