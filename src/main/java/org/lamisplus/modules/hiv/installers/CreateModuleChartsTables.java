package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(20)
@Installer(name = "create-module-charts-tables",
        description = "create module charts tables",
        version = 1)
public class CreateModuleChartsTables extends AcrossLiquibaseInstaller {
    public  CreateModuleChartsTables() {
        super("classpath:installers/hiv/schema/create_module_charts_tables.xml");
    }
}
