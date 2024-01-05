package org.lamisplus.modules.hiv.installers;


import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(2)
@Installer(name = "update-hiv_art_clinical_pregnancy_status",
		description = "add new columns",
		version = 14)
public class CreatePregnacyStatusColumnHIVClinic extends AcrossLiquibaseInstaller {
	public CreatePregnacyStatusColumnHIVClinic() {
		super("classpath:installers/hiv/schema/update_pregnancy_status.xml");
	}
}
