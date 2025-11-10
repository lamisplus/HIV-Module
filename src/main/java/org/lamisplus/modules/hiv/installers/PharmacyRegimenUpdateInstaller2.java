package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(17)
@Installer(name = "pharmacy-regimen-update-installer-two",
        description = "Installer for pharmacy regimen updates two",
        version = 2)
public class PharmacyRegimenUpdateInstaller2 extends AcrossLiquibaseInstaller {
    public PharmacyRegimenUpdateInstaller2() {
        super("classpath:installers/hiv/schema/pharmacy-regimen-update2.xml");
    }
}