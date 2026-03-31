package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(26)
@Installer(name = " update-all-occurrences-of-ABC-3TC-DTG",
        description = " update all occurrences of ABC-3TC-DTG to ABC+3TC+DTG in the database",
        version = 4)
public class UpdateRegimenABC3TCDTG extends AcrossLiquibaseInstaller {
    public UpdateRegimenABC3TCDTG() {
        super("classpath:installers/hiv/schema/update-regimen-abc-dtg.xml");
    }
}
