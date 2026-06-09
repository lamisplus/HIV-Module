package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(27)
@Installer(name = "positive-health-dignity-prevention-installer",
        description = "Create Positive Health Dignity and Prevention table for HIV patients",
        version = 2)
public class PositiveHealthDignityPreventionInstaller extends AcrossLiquibaseInstaller {
    public PositiveHealthDignityPreventionInstaller() {
        super("classpath:installers/hiv/schema/create-positive-health-dignity-prevention-table.xml");
    }
}
