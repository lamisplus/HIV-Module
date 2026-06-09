package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(110)
@Installer(
        name = "enrollment-session-uuid-installer",
        description = "Adds enrollment_session_uuid columns to track enrollment cycles across forms",
        version = 1
)
public class EnrollmentSessionUuidInstaller extends AcrossLiquibaseInstaller {

    public EnrollmentSessionUuidInstaller() {
        super("classpath:installers/hiv/schema/add-enrollment-session-uuid-columns.xml");
    }
}
