package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;


@Order(11)
@Installer(name = "dsd-outlet-schema-installer",
        description = "create dsd outlet table",
        version = 3)
public class  DSDOutletSchemaInstaller extends AcrossLiquibaseInstaller {
    public  DSDOutletSchemaInstaller() {
        super("classpath:installers/hiv/schema/dsd_outlet.xml");
    }
}

