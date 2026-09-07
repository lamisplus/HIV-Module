package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(24)
@Installer(name = "update-ndr-codeset-regimen-installer",
        description = "Update ndr_code_set and hiv_regimen_resolver to replace 'ABC+3TC(or FTC)+DTG' with 'ABC+3TC+DTG'",
        version = 7)
public class UpdateNDRCodesetRegimenInstaller extends AcrossLiquibaseInstaller {
    public UpdateNDRCodesetRegimenInstaller() {
        super("classpath:installers/hiv/schema/update-ndr-codeset-regimen.xml");
    }
}
