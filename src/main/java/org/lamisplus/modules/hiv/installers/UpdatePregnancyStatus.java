package org.lamisplus.modules.hiv.installers;
import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;


@Order(19)
@Installer(name = "update-pregnancy-status",
        description = "update hiv art clinical pregnancy status to save code",
        version = 1)
public class UpdatePregnancyStatus extends AcrossLiquibaseInstaller {
    public   UpdatePregnancyStatus() {
        super("classpath:installers/hiv/schema/update-pregnancy-status.xml");
    }
}
