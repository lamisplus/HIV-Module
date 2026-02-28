package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(27)
@Installer(name = "enrollment-commencement-column-installer",
        description = "Add enrollment_commencement_uuid foreign key column to hiv_art_clinical table and make nullable fields",
        version = 2)
public class EnrollmentCommencementColumnInstaller extends AcrossLiquibaseInstaller {
    public EnrollmentCommencementColumnInstaller() {
        super("classpath:installers/hiv/schema/add-enrollment-commencement-column.xml");
    }
}
