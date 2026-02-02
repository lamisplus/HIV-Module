package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(23)
@Installer(name = "laboratory-test-update-installer",
        description = "Update laboratory test records to consolidate lab test IDs and remove obsolete lab test definitions",
        version = 1)
public class LaboratoryTestUpdateInstaller extends AcrossLiquibaseInstaller {
    public LaboratoryTestUpdateInstaller() {
        super("classpath:installers/hiv/schema/laboratory-test-update.xml");
    }
}
