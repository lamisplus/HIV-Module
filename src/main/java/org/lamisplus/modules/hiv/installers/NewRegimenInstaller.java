package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(15)
@Installer(name = "new-regimen-installer",
        description = "Installer for new regimens",
        version = 2)
public class NewRegimenInstaller extends AcrossLiquibaseInstaller {
    public NewRegimenInstaller() {
        super("classpath:installers/hiv/schema/new-regimen.xml");
    }
}
