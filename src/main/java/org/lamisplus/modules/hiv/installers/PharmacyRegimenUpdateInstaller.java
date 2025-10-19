package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(16)
@Installer(name = "pharmacy-regimen-update-installer",
        description = "Installer for pharmacy regimen updates",
        version = 2)
public class PharmacyRegimenUpdateInstaller extends AcrossLiquibaseInstaller {
    public PharmacyRegimenUpdateInstaller() {
        super("classpath:installers/hiv/schema/pharmacy-regimen-update.xml");
    }
}
