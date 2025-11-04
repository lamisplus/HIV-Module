package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(21)
@Installer(name = "update-confirmed-tb-installer",
        description = "Installer update tbIptScreening status from 'Confirmed TB' to 'No Signs or symptoms of TB' where outcome is 'Not Presumptive'",
        version = 1)
public class UpdateConfirmedTB extends AcrossLiquibaseInstaller {
    public  UpdateConfirmedTB() {
        super("classpath:installers/hiv/schema/update-confirmedTB.xml");
    }
}
