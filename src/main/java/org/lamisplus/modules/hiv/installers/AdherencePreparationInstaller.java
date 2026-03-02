package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(28)
@Installer(name = "adherence-preparation-installer",
        description = "Create Adherence Preparation table for HIV patients",
        version = 1)
public class AdherencePreparationInstaller extends AcrossLiquibaseInstaller {
    public AdherencePreparationInstaller() {
        super("classpath:installers/hiv/schema/create-adherence-preparation-table.xml");
    }
}
