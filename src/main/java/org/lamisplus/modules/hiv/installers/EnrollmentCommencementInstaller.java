package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(100)
@Installer(
        name = "enrollment-commencement-installer",
        description = "Creates the enrollment_commencement and ICE tables and adds regimen_line_id column",
        version = 8
)
public class EnrollmentCommencementInstaller extends AcrossLiquibaseInstaller {

    public EnrollmentCommencementInstaller() {
        super("classpath:installers/hiv/schema/enrollment-commencement-schema.xml");
    }
}
