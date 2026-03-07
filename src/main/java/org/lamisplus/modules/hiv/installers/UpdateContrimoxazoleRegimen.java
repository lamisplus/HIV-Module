package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(27)
@Installer(name = "update-cotrimoxazole-regimen",
        description = "Update cotrimoxazole, regimen separators, HIV regimen composition, OI regimen codes, and TB NDR codes in the database",
        version = 10)
public class UpdateContrimoxazoleRegimen extends AcrossLiquibaseInstaller {
    public UpdateContrimoxazoleRegimen() {
        super("classpath:installers/hiv/schema/updateCotrimoxazoleRegimen.xml");
    }
}
