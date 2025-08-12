// "sixMonthsPEVLM": true,
// "twelveMonthsPEVLM": true,
// "eighteenMonthsPEVLM": true,
// "twenty-fourMonthsPEVLM": true,
// "thirtyMonthsPEVLM": true,
// "thirty-sixMonthsPEVLM": true,

<div className="card">
  <div
    className="card-header"
    style={{
      backgroundColor: "#014d88",
      color: "#fff",
      fontWeight: "bolder",
      borderRadius: "0.2rem",
    }}
  >
    <h5 className="card-title" style={{ color: "#fff" }}>
      Post Enrolment Viral Load Monitoring
    </h5>

    <>
      <span className="float-end" style={{ cursor: "pointer" }}>
        <FaPlus />
      </span>
    </>
  </div>

  <div>
    <div
      style={{
        backgroundColor: "#d8f6ff",
        width: "95%",
        margin: "auto",
        marginTop: "5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p
        style={{
          color: "black",
          fontSize: "15px",
          fontWeight: "600",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        6 months
      </p>
      <IconButton
        onClick={() =>
          setIsDropdownsOpen((prevState) => {
            return {
              ...prevState,
              sixMonthsPEVLM: !prevState.sixMonthsPEVLM,
            };
          })
        }
        aria-expanded={isDropdownsOpen.sixMonthsPEVLM}
        aria-label="Expand"
      >
        <ExpandMoreIcon />
      </IconButton>
    </div>

    <div className="card-body">
      <Collapse in={isDropdownsOpen.sixMonthsPEVLM}>
        <div className="basic-form" style={{ padding: "0 50px 0 50px" }}>
          <div className="row">
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="sixMonthsResult">
                  Result
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="sixMonthsResult"
                  id="sixMonthsResult"
                  value={formik.values.sixMonthsResult}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                ></Input>
                {formik.errors.sixMonthsResult !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.sixMonthsResult}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>

            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="sixMonthsDate">
                  Date
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <input
                  className="form-control"
                   type="date" onKeyPress={(e) => e.preventDefault()}
                  name="sixMonthsDate"
                  id="sixMonthsDate"
                  value={formik.values.sixMonthsDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                />
                {formik.errors.sixMonthsDate !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.sixMonthsDate}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  </div>

  <div>
    <div
      style={{
        backgroundColor: "#d8f6ff",
        width: "95%",
        margin: "auto",
        marginTop: "5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p
        style={{
          color: "black",
          fontSize: "15px",
          fontWeight: "600",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        12 months
      </p>
      <IconButton
        onClick={() =>
          setIsDropdownsOpen((prevState) => {
            return {
              ...prevState,
              twelveMonthsPEVLM: !prevState.twelveMonthsPEVLM,
            };
          })
        }
        aria-expanded={isDropdownsOpen.twelveMonthsPEVLM}
        aria-label="Expand"
      >
        <ExpandMoreIcon />
      </IconButton>
    </div>

    <div className="card-body">
      <Collapse in={isDropdownsOpen.twelveMonthsPEVLM}>
        <div className="basic-form" style={{ padding: "0 50px 0 50px" }}>
          <div className="row">
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="twelveMonthsResult">
                  Result
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="twelveMonthsResult"
                  id="twelveMonthsResult"
                  value={formik.values.twelveMonthsResult}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                ></Input>
                {formik.errors.twelveMonthsResult !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.twelveMonthsResult}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>

            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="twelveMonthsDate">
                  Date
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <input
                  className="form-control"
                   type="date" onKeyPress={(e) => e.preventDefault()}
                  name="twelveMonthsDate"
                  id="twelveMonthsDate"
                  value={formik.values.twelveMonthsDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                />
                {formik.errors.twelveMonthsDate !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.twelveMonthsDate}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  </div>

  <div>
    <div
      style={{
        backgroundColor: "#d8f6ff",
        width: "95%",
        margin: "auto",
        marginTop: "5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p
        style={{
          color: "black",
          fontSize: "15px",
          fontWeight: "600",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        18 months
      </p>
      <IconButton
        onClick={() =>
          setIsDropdownsOpen((prevState) => {
            return {
              ...prevState,
              eighteenMonthsPEVLM: !prevState.eighteenMonthsPEVLM,
            };
          })
        }
        aria-expanded={isDropdownsOpen.eighteenMonthsPEVLM}
        aria-label="Expand"
      >
        <ExpandMoreIcon />
      </IconButton>
    </div>

    <div className="card-body">
      <Collapse in={isDropdownsOpen.eighteenMonthsPEVLM}>
        <div className="basic-form" style={{ padding: "0 50px 0 50px" }}>
          <div className="row">
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="eighteenMonthsResult">
                  Result
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="eighteenMonthsResult"
                  id="eighteenMonthsResult"
                  value={formik.values.eighteenMonthsResult}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                >
                 
                </Input>
                {formik.errors.eighteenMonthsResult !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.eighteenMonthsResult}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
           

            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="eighteenMonthsDate">
                 Date
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <Input
                  className="form-control"
                   type="date" onKeyPress={(e) => e.preventDefault()}
                  name="eighteenMonthsDate"
                  id="eighteenMonthsDate"
                  value={formik.values.eighteenMonthsDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                >
                  
                </Input>
                {formik.errors.eighteenMonthsDate !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.eighteenMonthsDate}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  </div>

  <div>
    <div
      style={{
        backgroundColor: "#d8f6ff",
        width: "95%",
        margin: "auto",
        marginTop: "5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p
        style={{
          color: "black",
          fontSize: "15px",
          fontWeight: "600",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        24 months
      </p>
      <IconButton
        onClick={() =>
          setIsDropdownsOpen((prevState) => {
            return {
              ...prevState,
              twentyFourMonthsPEVLM: !prevState.twentyFourMonthsPEVLM,
            };
          })
        }
        aria-expanded={isDropdownsOpen.twentyFourMonthsPEVLM}
        aria-label="Expand"
      >
        <ExpandMoreIcon />
      </IconButton>
    </div>

    <div className="card-body">
      <Collapse in={isDropdownsOpen.twentyFourMonthsPEVLM}>
        <div className="basic-form" style={{ padding: "0 50px 0 50px" }}>
          <div className="row">
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="twentyFourMonthsResult">
                  Result
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="twentyFourMonthsResult"
                  id="twentyFourMonthsResult"
                  value={formik.values.twentyFourMonthsResult}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                >
                
                </Input>
                {formik.errors.twentyFourMonthsResult !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.twentyFourMonthsResult}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
            

            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="maMonth3LiteracyTreatmentChoice">
                 Date
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <Input
                  className="form-control"
                   type="date" onKeyPress={(e) => e.preventDefault()}
                  name="twentyFourMonthsDate"
                  id="twentyFourMonthsDate"
                  value={formik.values.twentyFourMonthsDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                >
                 
                </Input>
                {formik.errors.twentyFourMonthsDate !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.twentyFourMonthsDate}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  </div>

  <div>
    <div
      style={{
        backgroundColor: "#d8f6ff",
        width: "95%",
        margin: "auto",
        marginTop: "5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p
        style={{
          color: "black",
          fontSize: "15px",
          fontWeight: "600",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        30 months
      </p>
      <IconButton
        onClick={() =>
          setIsDropdownsOpen((prevState) => {
            return {
              ...prevState,
              thirtyMonthsPEVLM: !prevState.thirtyMonthsPEVLM,
            };
          })
        }
        aria-expanded={isDropdownsOpen.thirtyMonthsPEVLM}
        aria-label="Expand"
      >
        <ExpandMoreIcon />
      </IconButton>
    </div>

    <div className="card-body">
      <Collapse in={isDropdownsOpen.thirtyMonthsPEVLM}>
        <div className="basic-form" style={{ padding: "0 50px 0 50px" }}>
          <div className="row">
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="thirtyMonthsResult">
                  Result
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="thirtyMonthsResult"
                  id="thirtyMonthsResult"
                  value={formik.values.thirtyMonthsResult}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                >
                  
                </Input>
                {formik.errors.thirtyMonthsResult !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.thirtyMonthsResult}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
         

            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="thirtyMonthsDate">
                  Date
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <Input
                  className="form-control"
                   type="date" onKeyPress={(e) => e.preventDefault()}
                  name="thirtyMonthsDate"
                  id="thirtyMonthsDate"
                  value={formik.values.thirtyMonthsDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                >
                 
                </Input>
                {formik.errors.thirtyMonthsDate !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.thirtyMonthsDate}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  </div>

  <div>
    <div
      style={{
        backgroundColor: "#d8f6ff",
        width: "95%",
        margin: "auto",
        marginTop: "5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p
        style={{
          color: "black",
          fontSize: "15px",
          fontWeight: "600",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        36 months
      </p>
      <IconButton
        onClick={() =>
          setIsDropdownsOpen((prevState) => {
            return {
              ...prevState,
              thirtySixMonthsPEVLM: !prevState.thirtySixMonthsPEVLM,
            };
          })
        }
        aria-expanded={isDropdownsOpen.thirtySixMonthsPEVLM}
        aria-label="Expand"
      >
        <ExpandMoreIcon />
      </IconButton>
    </div>

    <div className="card-body">
      <Collapse in={isDropdownsOpen.thirtySixMonthsPEVLM}>
        <div className="basic-form" style={{ padding: "0 50px 0 50px" }}>
          <div className="row">
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="thirtySixMonthsResult">
                  Result
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="thirtySixMonthsResult"
                  id="thirtySixMonthsResult"
                  value={formik.values.thirtySixMonthsResult}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                >
                  
                </Input>
                {formik.errors.thirtySixMonthsResult !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.thirtySixMonthsResult}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
            

            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="thirtySixMonthsDate">
                 Date
                  <span style={{ color: "red" }}> *</span>{" "}
                </Label>
                <Input
                  className="form-control"
                  type="select"
                  name="thirtySixMonthsDate"
                  id="thirtySixMonthsDate"
                  value={formik.values.thirtySixMonthsDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                >
                  
                </Input>
                {formik.errors.thirtySixMonthsDate !== "" ? (
                  <span className={classes.error}>
                    {formik.errors.thirtySixMonthsDate}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  </div>
</div>
