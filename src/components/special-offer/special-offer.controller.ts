import { Request, Response } from 'express';
import { SpecialOfferService } from './special-offer.service';

export class SpecialOfferController {
    private specialOfferService: SpecialOfferService;

    constructor() {
        this.specialOfferService = new SpecialOfferService();
    }

    getAllSpecialOffers = async (req: Request, res: Response): Promise<void> => {
        try {
            const specialOffers = await this.specialOfferService.getAllSpecialOffers();
            res.status(200).json(specialOffers);
        } catch (error) {
            console.error('Error getting all special offers:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getSpecialOfferById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }

            const specialOffer = await this.specialOfferService.getSpecialOfferById(id);
            if (!specialOffer) {
                res.status(404).json({ message: 'Special offer not found' });
                return;
            }

            res.status(200).json(specialOffer);
        } catch (error) {
            console.error('Error getting special offer by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    createSpecialOffer = async (req: Request, res: Response): Promise<void> => {
        try {
            const specialOffer = await this.specialOfferService.createSpecialOffer(req.body);
            res.status(201).json(specialOffer);
        } catch (error) {
            console.error('Error creating special offer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    updateSpecialOffer = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }

            const updatedSpecialOffer = await this.specialOfferService.updateSpecialOffer(id, req.body);
            if (!updatedSpecialOffer) {
                res.status(404).json({ message: 'Special offer not found' });
                return;
            }

            res.status(200).json(updatedSpecialOffer);
        } catch (error) {
            console.error('Error updating special offer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    deleteSpecialOffer = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }

            const deleted = await this.specialOfferService.deleteSpecialOffer(id);
            if (!deleted) {
                res.status(404).json({ message: 'Special offer not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            console.error('Error deleting special offer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}