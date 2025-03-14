#  HIV_Module
## Description
The **LAMISPlus HIV Module** is a specialized component of the **LAMISPlus** software suite, tailored to meet the needs of healthcare providers managing HIV/AIDS patients. It provides a centralized platform for tracking patient enrollment, antiretroviral therapy (ART) adherence, laboratory results, and program performance metrics. By integrating clinical workflows with robust monitoring and evaluation tools, this module empowers healthcare systems to deliver high-quality, data-driven care while supporting compliance with global health standards such as PEPFAR and UNAIDS targets.

- ## Key Features

- **Patient Registration & Management**: Capture demographic details and track patient enrollment in HIV care programs.
- **Clinical Care & Treatment**: Manage ART initiation, follow-ups, and adherence counseling.
- **Laboratory Services**: Track CD4 counts, viral load tests, and other critical lab investigations.
- **Pharmacy & Drug Management**: Handle ART drug inventory, prescriptions, and dispensing.
- **Monitoring & Evaluation (M&E)**: Generate real-time reports and dashboards for program performance tracking.
- **Data Privacy & Security**: Ensure secure, role-based access to sensitive patient information.
- **Interoperability**: Seamlessly integrate with other modules (e.g., TB, Malaria) and external health systems like DHIS2 and OpenMRS.
  
## System Requirements

### Prerequisites to Install
- IDE of choice (IntelliJ, Eclipse, etc.)
- Java 8+
- node.js
- React.js
## Run in Development Environment

### How to Install Dependencies
1. Install Java 8+
2. Install PostgreSQL 14+
3. Install node.js
4. Install React.js
5. Open the project in your IDE of choice.

### Update Configuration File
1. Update other Maven application properties as required.

### Run Build and Install Commands
1. Change the directory to `src`:
    ```bash
    cd src
    ```
2. Run Frontend Build Command:
    ```bash
    npm run build
    ```
3. Run Maven clean install:
    ```bash
    mvn clean install
    ```

## How to Package for Production Environment
1. Run Maven package command:
    ```bash
    mvn clean package
    ```

## Launch Packaged JAR File
1. Launch the JAR file:
    ```bash
    java -jar <path-to-jar-file>
    ```
2. Optionally, run with memory allocation:
    ```bash
    java -jar -Xms4096M -Xmx6144M <path-to-jar-file>
    ```

## Visit the Application
- Visit the application on a browser at the configured port:
    ```
    http://localhost:8080
    ```

## Access Swagger Documentation
- Visit the application at:
    ```
    http://localhost:8080/swagger-ui.html#/
    ```

## Access Application Logs
- Application logs can be accessed in the `application-debug` folder.

## Authors & Acknowledgments
### Main contributors
- Victor Ajor   https://github.com/AJ-DataFI
- Mathew Adegbite https://github.com/mathewade 
