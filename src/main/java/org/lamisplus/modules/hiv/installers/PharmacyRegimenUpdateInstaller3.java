package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(22)
@Installer(name = "pharmacy-regimen-update-installer-three",
        description = "Installer for adding new HIV drugs and regimen mappings",
        version = 3)
public class PharmacyRegimenUpdateInstaller3 extends AcrossLiquibaseInstaller {
    public PharmacyRegimenUpdateInstaller3() {
        super("classpath:installers/hiv/schema/pharmacy-regimen-update3.xml");
    }
}
