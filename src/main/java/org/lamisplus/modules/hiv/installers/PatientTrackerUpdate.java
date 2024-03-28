package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(8)
@Installer(name = "patient-tracker-update-installer",
        description = "Update patient tracker table",
        version = 2)
public class PatientTrackerUpdate extends AcrossLiquibaseInstaller {
    public  PatientTrackerUpdate() {
        super ("classpath:installers/hiv/schema/patient-tracker-update.xml");
    }
}
