package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(8)
@Installer(name = "update-regimen-table",
        description = "update regimen table",
        version = 10)
public class UpdateRegimen extends AcrossLiquibaseInstaller{
    public UpdateRegimen() {
        super("classpath:installers/hiv/schema/update_regimen.xml");
    }
}
