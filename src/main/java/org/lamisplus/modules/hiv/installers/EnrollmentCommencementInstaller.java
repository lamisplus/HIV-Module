package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(100)
@Installer(
        name = "enrollment-commencement-installer",
        description = "Creates the enrollment_commencement and ICE tables, removes pregnancy_status and adds is_breast_feeding column, updates regimen_id and regimen_line_id to BIGINT",
        version = 22
)
public class EnrollmentCommencementInstaller extends AcrossLiquibaseInstaller {

    public EnrollmentCommencementInstaller() {
        super("classpath:installers/hiv/schema/enrollment-commencement-schema.xml");
    }
}
