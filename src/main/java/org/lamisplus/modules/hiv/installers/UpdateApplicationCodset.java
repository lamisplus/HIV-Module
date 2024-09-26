package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;


@Order(9)
@Installer(name = "update-base_application-codeset-table",
        description = "update base application codeset table",
        version = 3)
public class UpdateApplicationCodset extends AcrossLiquibaseInstaller {
    public UpdateApplicationCodset() {
        super("classpath:installers/hiv/schema/update_application_codeset.xml");
    }
}
